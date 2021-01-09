const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const nodemailer =  require('nodemailer');
const accountService = require('./accountService');
const Otp = require('../../models/Otp');
const swal = require('sweetalert2');

const SALT = 10;

const sendMail = (email) => {
    // Tạo otp và thêm vào database
    var otp = Math.floor(Math.random() * 899999) + 100000;
    const otpData = {
        content: otp,
        time: Date.now(),
        email
    }
    Otp.create(otpData).then(()=>{
        //console.log("Tạo otp thành công");
    }).catch(()=>{
        console.log("Error");
    })

    // Gửi mail
    var transporter =  nodemailer.createTransport({ // config mail server
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'ddtcourses@gmail.com', //Tài khoản admin
            pass: 'ddt_123456' //Mật khẩu admin
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    var content = '';
    content += `
        <div>
            <div>
                <span style="color: black">Mã xác nhận email của bạn là: <b>${otp}</b> </span>
            </div>
        </div>
    `;
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'DDT Courses',
        to: email,
        subject: 'Xác nhận email - Đăng ký tài khoản',
        html: content //Nội dung html mình đã tạo trên kia :))
    }
    transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log(err);
        } else {
            //console.log("Gửi mail thành công");
        }
    });
}

class AccountController {
    // [GET] account/login
    getLogin(req, res) {
        res.render('vwAccount/login', {
            layout: false,
        });
    }

    // [POST] account/login
    async postLogin(req, res, next){
        const user = req.body;
        const listAccount = await accountService.getUserByEmail(user.email);
        if(listAccount === null ){ 
            return res.render('vwAccount/login', {
                layout: false,
                error1: 'Không tìm thấy email'
            });
        }

        const ret = bcrypt.compareSync(user.password, listAccount.password);
        if(ret === false) {
            
            return res.render('vwAccount/login', {
                layout: false,
                error2: 'Mật khẩu không đúng'
            });
        } else{
            req.session.isAuth = true;
            req.session.authUser = listAccount;

            if(listAccount.permission === 0){
                let url = req.session.retUrl || '/admin';
                res.redirect(url);
            }else if(listAccount.permission === 1){
                let url = req.session.retUrl || '/lecturer';
                res.redirect(url)
            }else{
                let url =  req.session.retUrl ||'/';
                res.redirect(url)
            }
        }
    }

    postLogout(req, res){
        req.session.isAuth = false;
        req.session.authUser = null;
        res.redirect(req.headers.referer);
    }

    // [GET] account/register
    getRegister(req, res) {
        res.render('vwAccount/register', {
            layout: false,
        });
    }

    // [POST] account/register
    async postRegister(req, res, next) {
        // check email
        const checkEmail = await accountService.findUserByEmail(req.body.email);
        if (checkEmail === false){
            console.log("Email đã được sử dụng");
            //swal.fire('Oops...', 'Something went wrong!', 'error')
            return res.render('vwAccount/register', {
                layout: false,
            });
        }

        // delete otp 
        await accountService.deleteOtpByEmail(req.body.email);

        // tạo otp và gửi mail
        sendMail(req.body.email);

        // Lưu biến check đã nhập form đăng ký
        req.session.isRegister = true;
        req.session.userRegister = req.body;
        res.redirect('/account/confirm');
    }

    // [GET] account/confirm
    async confirmRegister(req, res) {
        if(req.session.isRegister !== true ){
            return res.redirect('/account/register');
        }
        res.render('vwAccount/confirmregister', {
            layout: false,
        }); 
    }   

    async postConfirmRegister(req, res, next){
        const user = req.session.userRegister;
        if (user === undefined ){
            return res.redirect('/account/register')
        }
        
        const data = req.body;
        const otp = await accountService.getOtpByEmail(user.email);
        const checkOtp = data.zero + data.first + data.second + data.third + data.four + data.fifth; 
       
        if (otp === checkOtp){
            //console.log("Tạo tài khoản thành công");
            const hash = bcrypt.hashSync(user.password, SALT);
            const userData = {
                name: user.name,
                email: user.email,
                password: hash,
                permission: 2,
            };

            User.create(userData)
                .then( async () => {
                    await accountService.deleteOtpByEmail(user.email);
                    req.session.isRegister = false;
                    req.session.userRegister = null;
                    return res.redirect('/account/login');
                })
                .catch(next);
        }else{
            console.log("OTP không chính xác");
            res.redirect('/account/confirm');
        }
        
    }

    async postResetConfirmRegister (req, res, next ){
        if(req.session.isRegister !== true ){
            return res.redirect('/account/register');
        }

        const user = req.session.userRegister;
        if (user === null ){
            return res.redirect('/account/register')
        }
        // delete otp 
        await accountService.deleteOtpByEmail(user.email);

        // tạo otp và gửi mail
        sendMail(user.email);
        res.render('vwAccount/confirmregister', {
            layout: false,
        });
    }

    // [GET] account/forgotpassword
    forgotPassword(req, res) { 
        res.render('vwAccount/forgotpassword', {
            layout: false,
        });
    }

    // [GET] account/resetpassword
    resetPassword(req, res) {
        res.render('vwAccount/resetpassword', {
            layout: false,
        });
    }
}

module.exports = new AccountController();

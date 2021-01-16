const userService = require('./userService');
const bcrypt = require('bcryptjs');
const Otp = require('../../models/Otp');
const User = require('../../models/User');
const Course = require('../../models/Course');
const nodemailer =  require('nodemailer');
const {mongooseToObject, multipleMongooseToObject} = require('../../utils/mongoose');

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
            pass: 'tuando24101997' //Mật khẩu admin
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

class UserController {

    manage(req, res){
        res.render('vwUser/manageAccount', {
            layout: "user"
        })
    }

    async postManage(req, res){
        //console.log(req.body);
        const data = req.body;
        const idUser = req.session.authUser._id;
        data.id = idUser;
        const oldEmail = req.session.authUser.email;

        if(oldEmail === data.email){
            await userService.updateUserById(idUser, data);
            // cập nhật lại authUser;
            const newUser = await userService.getUserById(idUser);
            //console.log(newUser);
            req.session.authUser = newUser;
            return res.redirect('/');
        }

        const checkUser = await userService.getUserByEmail(data.email);
        
        if(checkUser === false){
            console.log("Email đã được sử dụng");
            const url = '/user/manage/' + idUser || '/'
            return res.redirect(url); 
        }

        await userService.deleteOtpByEmail(data.email);
        sendMail(data.email);
        req.session.isUpdateAccount = true;
        req.session.accountUpdate = data;
        return res.redirect('/user/confirm')
        
    }

    changepassword(req, res){
        res.render('vwUser/changepassword', {
            layout: "user"
        })
    }

    async postChangePassword(req, res){
        const data = req.body;
        const user = req.session.authUser;
       
        const ret = bcrypt.compareSync(data.oldpassword, user.password);
        //console.log(ret);
        if(ret === false) {
            console.log("Mật khẩu cũ không chính xác");
            const url = '/user/changepassword/' + user._id;
            return res.redirect(url)
        }
        if (data.newpassword.length < 6){
            console.log("Mật khẩu phải lớn hơn 6 kí tự");
            const url = '/user/changepassword/' + user._id;
            return res.redirect(url);
        }else if (data.newpassword !== data.confirmpassword){
            console.log("Mật khẩu không trùng khớp");
            const url = '/user/changepassword/' + user._id;
            return res.redirect(url);
        }

        const newpwHash = bcrypt.hashSync(data.newpassword, SALT);
        await userService.updatePasswordById(user._id, newpwHash);
        return res.redirect('/');
    }

    confirm(req, res){
        if(req.session.isUpdateAccount !== true){
            return res.redirect('/'); 
        }

        res.render('vwUser/confirm', {
            layout: false
        });
    }

    async postconfirm(req, res){
        const data1 = req.body;
        const data = req.session.accountUpdate;

        const otp = await userService.getOtpByEmail(data.email);
        const checkOtp = data1.zero + data1.first + data1.second + data1.third + data1.four + data1.fifth; 
        if(otp === checkOtp){
            await userService.updateUserById(data.id, data);
            // cập nhật lại authUser;
            const newUser = await userService.getUserById(data.id);
           
            req.session.authUser = newUser;
            req.session.isUpdateAccount = false;
            req.session.accountUpdate = null;
            return res.redirect('/');

            // Xóa otp vừa nhập thành công
            // ....

        }
        return res.redirect('/user/confirm');
    }

    listcoursebookmark(req, res){
        res.render('vwUser/bookmark', {
            layout: 'user'
        })
    }

    mycourse(req, res){
        const userId = req.session.authUser._id;
        User.findOne({_id: userId})
            .then(user => user.courses)
            .then(async courseIds => {
                console.log("abc", courseIds);
                let courses = [];
                for(let id of courseIds) {
                    const course = await Course.findOne({_id: id}).lean();
                    courses.push(course);
                }
                res.render('vwUser/mycourses', {
                    layout: 'user',
                    courses
                })
            })
    }

    async addCourseBookmark(req, res, next){
        
        let course = await userService.getCourseById(req.params.id);
        course = mongooseToObject(course);
        
        const newData = {
            id: course._id,
            name: course.name,
            initialPrice: course.initialPrice,
            currentPrice: course.currentPrice,
            folderName: course.folderName,
            avatar: course.avatar,
            totalRating: course.totalRating,
            quantityRating: course.quantityRating
        }
        
        let listcourse = req.session.authUser.favorCourse;

        listcourse.forEach(element => {
            if(element.id === newData.id){
                console.log("Bạn đã yêu thích khóa học");
                return res.redirect('back');
            }
        });
        listcourse.push(newData);
        console.log(listcourse);
        await userService.updateListCourseUserById(req.session.authUser._id, listcourse);
        return res.redirect('back');
    }
}

module.exports = new UserController();

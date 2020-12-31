const bcrypt = require('bcryptjs');
const User = require('../../models/User');

const SALT = 10;
class AccountController {
    // [GET] account/login
    getLogin(req, res) {
        res.render('vwAccount/login', {
            layout: false,
        });
    }

    // [GET] account/register
    getRegister(req, res) {
        res.render('vwAccount/register', {
            layout: false,
        });
    }

    // [POST] account/register
    postRegister(req, res, next) {
        const hash = bcrypt.hashSync(req.body.password, SALT);
        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: hash,
            permission: 0,
        };

        User.create(userData)
            .then(() => {
                res.redirect('/account/login');
            })
            .catch(next);
    }

    // [GET] account/confirm
    confirmRegister(req, res) {
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
}

module.exports = new AccountController();

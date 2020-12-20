class AccountController {
    // [GET] account/login
    getLogin(req, res) {
        res.render('vwAccount/login',{
            layout: false,
        });
    }

     // [GET] account/register
    getRegister(req, res) {
        res.render('vwAccount/register', {
            layout: false,
        });
    }

    confirmRegister(req, res) {
        res.render('vwAccount/confirmregister', {
            layout: false,
        });
    }
}

module.exports = new AccountController();
class LoginController {
    // [GET] /login
    index(req, res) {
        res.render('vwAccount/login',{
            layout: false,
        });
    }
}

module.exports = new LoginController();
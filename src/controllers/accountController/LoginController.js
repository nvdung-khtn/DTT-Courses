class LoginController {
    // [GET] /login
    index(req, res) {
        res.render('accountView/login',{
            layout: false,
        });
    }
}

module.exports = new LoginController();
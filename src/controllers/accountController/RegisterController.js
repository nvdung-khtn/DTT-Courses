class RegisterController {
    // [GET] /register
    index(req, res) {
        res.render('accountView/register', {
            layout: false,
        });
    }
}

module.exports = new RegisterController();
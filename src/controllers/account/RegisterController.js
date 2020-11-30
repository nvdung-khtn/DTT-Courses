class RegisterController {
    // [GET] /register
    index(req, res) {
        res.render('vwAccount/register', {
            layout: false,
        });
    }
}

module.exports = new RegisterController();
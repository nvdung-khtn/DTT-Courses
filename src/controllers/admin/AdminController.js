class AdminController {
    // [GET] /home
    index(req, res) {
        res.render('vwAdmin/index', {
            layout: false,
        });
    }
}

module.exports = new AdminController();
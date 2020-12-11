class AdminController {
    // [GET] /home
    index(req, res) {
        res.render('vwAdmin/index', {
            layout: "admin",
        });
    }
}

module.exports = new AdminController();
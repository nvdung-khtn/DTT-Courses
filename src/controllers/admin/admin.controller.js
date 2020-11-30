class AdminController {
    // [GET] /home
    index(req, res) {
        res.render('admin/index', {
            layout: false,
        });
    }
}

module.exports = new AdminController();
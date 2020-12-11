class ManageProductController {
    // [GET] /home
    index(req, res) {
        res.render('vwAdmin/ManageProduct/qlsp', {
            layout: "admin",
        });
    }
}

module.exports = new ManageProductController();
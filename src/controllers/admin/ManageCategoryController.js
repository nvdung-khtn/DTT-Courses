class ManageCategoryController {
    // [GET] /home
    index(req, res) {
        res.render('vwAdmin/ManageProduct/category', {
            layout: "admin",
        });
    }
}

module.exports = new ManageCategoryController();
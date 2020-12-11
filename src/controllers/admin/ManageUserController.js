class ManageUserController {
    // [GET] /home
    index(req, res) {
        res.render('vwAdmin/ManageUser/qlkh', {
            layout: "admin",
        });
    }
}

module.exports = new ManageUserController();
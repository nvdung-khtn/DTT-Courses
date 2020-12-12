class ManageLecturerController {
    // [GET] /home
    index(req, res) {
        res.render('vwAdmin/ManageUser/lecturer', {
            layout: "admin",
        });
    }
}

module.exports = new ManageLecturerController();
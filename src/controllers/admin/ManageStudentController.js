class ManageStudentController {
    // [GET] /home
    index(req, res) {
        res.render('vwAdmin/ManageUser/student', {
            layout: "admin",
        });
    }
}

module.exports = new ManageStudentController();
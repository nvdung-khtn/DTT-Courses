class LecturerController {
    // [GET] /home
    index(req, res) {
        res.render('vwLecturer/manageLecturer', {
            layout: "lecturer",
        });
    }
}

module.exports = new LecturerController();
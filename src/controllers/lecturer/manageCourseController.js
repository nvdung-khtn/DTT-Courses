class manageCourseController {
    // [GET] /home
    index(req, res) {
        res.render('vwLecturer/manageAllCourse', {
            layout: "lecturer",
        });
    }
}

module.exports = new manageCourseController();
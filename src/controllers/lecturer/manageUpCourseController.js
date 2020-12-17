class manageUpCourseController {
    // [GET] /home
    index(req, res) {
        res.render('vwLecturer/manageUpCourse', {
            layout: "lecturer",
        });
    }
}

module.exports = new manageUpCourseController();
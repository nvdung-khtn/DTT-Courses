class LecturerController {
    // [GET] /
    index(req, res) {
        res.render('vwLecturer/manageCourses', {
            layout: "lecturer",
        });
    }

    showProfile(req, res) {
        res.render('vwLecturer/manageProfile', {
            layout: "lecturer",
        });
    }

    // [GET] lecturer/course/create
    create(req, res, next) {
        res.render('vwLecturer/createCourse', {
            layout: "lecturer",
        });
    }

}

module.exports = new LecturerController();
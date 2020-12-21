const Course = require('../../models/Course');
const { mongooseToObject } = require('../../utils/mongoose')

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

    // [POST] lecturer/course/store
    store(req, res, next) {
        // req.body.image = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
        const course = new Course(req.body);
        course
            .save()
            .then(() => res.redirect('/lecturer/courses'))
            .catch((error) => {});
    }
}

module.exports = new LecturerController();
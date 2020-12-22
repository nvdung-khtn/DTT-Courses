const Course = require('../../models/Course');
const courseService = require('./courseService');
const { multipleMongooseToObject, mongooseToObject } = require('../../utils/mongoose');

class CourseController {
    // [GET] /course
    index(req, res, next) {
        Course.find({})
            .then(coursesDB => {
                // convert Mongoose Object to Object Literals
                let courses = multipleMongooseToObject(coursesDB);
                res.render('home_fullCourse', {
                    courses: courseService.getInforCourses(courses)
                });
            })
            .catch(next);
    }

    // [GET] /courses/:slug
    show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then(course => {
                res.render('vwCourse/detailCourse', {
                    course: mongooseToObject(course),
                    layout: 'course',
                })
            })
            .catch(next);
    }
}

module.exports = new CourseController();

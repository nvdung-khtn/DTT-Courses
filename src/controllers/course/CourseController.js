const Course = require('../../models/Course');
const { multipleMongooseToObject, mongooseToObject } = require('../../utils/mongoose');

class CourseController {
    // [GET] /course
    index(req, res, next) {
        Course.find({})
            .then(courses => {
                // convert Mongoose Object to Object Literals
                res.render('home_fullCourse', {
                    courses: multipleMongooseToObject(courses),
                });
            })
            .catch(next);
    }

    // [GET] /courses/:slug
    show(req, res, next) {
        console.log(`slug: ${req.params.slug}`);
        Course.findOne({ slug: req.params.slug })
            .then(course => {
                res.render('vwCourse/detailCourse', {
                    course: mongooseToObject(course),
                    layout: 'course',
                }),
                console.log(mongooseToObject(course))
            })
            .catch(next);
    }
}

module.exports = new CourseController();

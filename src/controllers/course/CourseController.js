const Course = require('../../models/Course');
const { multipleMongooseToObject } = require('../../utils/mongoose')

class CourseController {
    // [GET] /course
    index(req, res, next) {
        Course.find({})
            .then((courses) => {
                // convert Mongoose Object to Object Literals
                res.render('home_fullCourse', { 
                    courses: multipleMongooseToObject(courses),
                })
            })
            .catch(next);
    }
}

module.exports = new CourseController();

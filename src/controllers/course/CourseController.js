const Course = require('../../models/Course');
const courseService = require('./courseService');
const { multipleMongooseToObject, mongooseToObject } = require('../../utils/mongoose');

class CourseController {
    // [GET] /courses
    index(req, res, next) {
        Course.find({})
            .then(async coursesDB => {
                // convert Mongoose Object to Object Literals
                const courses = await courseService.getInforCourses(multipleMongooseToObject(coursesDB));
                res.render('home_fullCourse', {
                    courses
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

    videoCourse(req, res) {
        res.render('vwCourse/videoCourse', {
            layout: false
        })
        
    }

    // exits index => true
    hasIndexLesson(req, res) {
        const data = req.body;

        Course.findOne({slug: data.slug})
            .then( course => course.lessons )
            .then (lessons => {
                let status = false;
                lessons.forEach(element => {
                    if(element.index == data.index) {
                        status = true;
                    }
                });
                console.log('status', status);
                res.json({status});
            })
    }
}

module.exports = new CourseController();

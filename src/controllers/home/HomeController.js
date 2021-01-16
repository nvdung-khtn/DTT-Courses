const Course = require('../../models/Course');
const { multipleMongooseToObject} = require('../../utils/mongoose')
const homeService = require('./homeService');
const courseService = require('../course/courseService');


class SiteController {
    // [GET] /
    // Khóa học nổi bật: h_lightCourses
    // Khóa học được xem nhiều nhất: mostViewedCourses
    // Khóa học mới nhất: newCourses

    index(req, res, next) {
        Course.find({})
            .then(async coursesDB => {
                // convert Mongoose Object to Object Literals
                let ids = [];
                const courses = await courseService.getInforCourses(multipleMongooseToObject(coursesDB), ids);
                // Customize Course
                //console.log(courses);
                const hightLightCourse = homeService.getHighLightCourse(courses, 4);
                const mostViewedCourses = homeService.getMostViewedCourse(courses, 10);
                const newCourses = homeService.getNewCourse(courses, 10);
                
                res.render('home', { 
                    hightLightCourse,
                    mostViewedCourses,
                    newCourses,
                    ids
                })
            })
            .catch(next);
    }

}

module.exports = new SiteController();

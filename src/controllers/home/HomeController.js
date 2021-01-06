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
                const courses = await courseService.getInforCourses(multipleMongooseToObject(coursesDB));
                const hightLightCourse = homeService.getHighLightCourse(courses, 4);
                const mostViewedCourses = homeService.getMostViewedCourse(courses, 4);
                const newCourses = homeService.getNewCourse(courses,5);
                console.log(req.session.isAuth);
                console.log(req.session.authUser);
                res.render('home', { 
                    hightLightCourse,
                    mostViewedCourses,
                    newCourses
                })
            })
            .catch(next);
    }
}

module.exports = new SiteController();

const Course = require('../../models/Course');
const Field = require('../../models/Field')
const Category = require('../../models/Category');
const { multipleMongooseToObject} = require('../../utils/mongoose')
const homeService = require('./homeService');
const courseService = require('../course/courseService');


class SiteController {
    // [GET] /
    // Khóa học nổi bật: h_lightCourses
    // Khóa học được xem nhiều nhất: mostViewedCourses
    // Khóa học mới nhất: newCourses

    async index(req, res, next) {
        const courses = await Course.find().lean();
        await courseService.getInforCourses(courses);
        const hightLightCourse = homeService.getHighLightCourse(courses, 4);
        const mostViewedCourses = homeService.getMostViewedCourse(courses, 10);
        const newCourses = homeService.getNewCourse(courses, 10);

        res.render('home', { 
            hightLightCourse,
            mostViewedCourses,
            newCourses,
            courses,
        })
    }

}

module.exports = new SiteController();

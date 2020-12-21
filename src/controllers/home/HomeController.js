const Course = require('../../models/Course');
const { multipleMongooseToObject} = require('../../utils/mongoose')
const homeService = require('./homeService');


class SiteController {
    // [GET] /
    // Khóa học nổi bật: h_lightCourses
    // Khóa học được xem nhiều nhất: mostViewedCourses
    // Khóa học mới nhất: newCourses

    index(req, res, next) {
        Course.find({})
            .then((coursesDB) => {
                // convert Mongoose Object to Object Literals
                const courses = multipleMongooseToObject(coursesDB)
                const hightLightCourse = homeService.getHighLightCourse(courses);
                const mostViewedCourses = homeService.getMostViewedCourse(courses, 4);
                const newCourses = homeService.getNewCourse(courses,5);

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

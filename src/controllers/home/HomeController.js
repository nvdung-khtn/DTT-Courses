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
                const courses = multipleMongooseToObject(coursesDB) //Khóa học nổi bật
                // convert Mongoose Object to Object Literals
                const mostViewedCourses = homeService.filterMostViewedCourse(courses);
                const newCourses = homeService.filterNewCourse(courses);
                console.log(newCourses);
                res.render('home', { 
                    courses,
                    mostViewedCourses,
                    newCourses
                })
               
            })
            .catch(next);
    }
}

module.exports = new SiteController();

const Course = require('../models/Course');
const { multipleMongooseToObject } = require('../utils/mongoose')

class SiteController {
    // [GET] /
    index(req, res, next) {
        Course.find({})
            .then((courses) => {
                // convert Mongoose Object to Object Literals
                res.render('home', { 
                    courses: multipleMongooseToObject(courses),
                })
            })
            .catch(next);
    }
}

module.exports = new SiteController();

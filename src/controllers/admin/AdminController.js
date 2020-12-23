const Course = require('../../models/Course');
const courseService = require('../course/courseService')
const { multipleMongooseToObject, mongooseToObject } = require('../../utils/mongoose');

class AdminController {
    // [GET] /home
    index(req, res) {
        res.render('vwAdmin/index', {
            layout: "admin",
        });
    }

    manageCategory(req, res) {
        res.render('vwAdmin/ManageProduct/category', {
            layout: "admin",
        });
    }

    manageLecturer(req, res) {
        res.render('vwAdmin/ManageUser/lecturer', {
            layout: "admin",
        });
    }

    manageProduct(req, res,next) {
        Course.find({})
            .then(coursesDB => {
                let courses = multipleMongooseToObject(coursesDB);

                for (var i in courses) {
                    
                    if (courses[i].status === false) {
                        courses[i].status = 'Chua hoan thanh';
                    }
                    else {
                        courses[i].status = 'Hoan thanh'
                    }

                    console.log(parseInt(courses[i].status.toString()));

                }
                

                res.render('vwAdmin/ManageProduct/qlsp', {
                    layout: "admin",
                    courses: courseService.getInforCourses(courses),
                });
            })
            .catch(next);
        
    }

    manageStudent(req, res) {
        res.render('vwAdmin/ManageUser/student', {
            layout: "admin",
        });
    }

    editStudent(req, res) {
        res.render('vwAdmin/ManageUser/editUser', {
            layout: "admin",
        });
    }

    editLecturer(req, res) {
        res.render('vwAdmin/ManageUser/editLecturer', {
            layout: "admin",
        });
    }

    editCourse(req, res) {
        res.render('vwAdmin/ManageProduct/editCourse', {
            layout: "admin",
        });
    }
}

module.exports = new AdminController();
const Course = require('../../models/Course');
const User = require('../../models/User');
const moment = require('moment');
const courseService = require('../course/courseService');
const userService = require('../user/userService');
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

    manageLecturer(req, res, next) {
        User.find({})
            .then(usersDB => {
                let users = multipleMongooseToObject(usersDB);
                users = userService.convertStatusToStatusString(users);
                res.render('vwAdmin/ManageUser/lecturer', {
                    layout: "admin",
                    users: userService.getInforLecturer(users)
                })
            })
            .catch(next)
    }

    manageProduct(req, res, next) {
        Course.find({})
            .then(coursesDB => {
                let courses = multipleMongooseToObject(coursesDB);

                for (var i in courses) {

                    if (courses[i].status === false) {
                        courses[i].status = 'Chưa hoàn thành';
                    }
                    else {
                        courses[i].status = 'Hoành thành'
                    }
                }
                res.render('vwAdmin/ManageProduct/qlsp', {
                    layout: "admin",
                    courses
                });
            })
            .catch(next);
    }

    manageStudent(req, res, next) {
        User.find({})
            .then(usersDB => {
                let users = multipleMongooseToObject(usersDB);
                users = userService.convertStatusToStatusString(users);
                res.render('vwAdmin/ManageUser/student', {
                    layout: "admin",
                    users: userService.getInforStudent(users)
                })
            })
            .catch(next)
    }

    editStudent(req, res, next) {
        User.findOne({_id: req.params.id})
            .then(studentDB => {
                let student = mongooseToObject(studentDB);
                student = userService.getInfoTotalCourse(student);
                student.createdAt = moment(student.createdAt).format("DD/MM/YYYY");
                student.dob = moment(student.dob).format("DD/MM/YYYY");
                if (student.status === false) {
                    student.status = 'Chưa kích hoạt'
                }
                else { student.status = 'Đã kích hoạt'}
                res.render('vwAdmin/ManageUser/editUser', {
                    layout: "admin",
                    student
                });
            })
            .catch(next)
    }

    editLecturer(req, res, next) {
        User.findOne({_id: req.params.id})
            .then(lecturerDB => {
                let lecturer = mongooseToObject(lecturerDB);
                lecturer = userService.getInfoTotalCourse(lecturer);
                if (lecturer.status === false) {
                    lecturer.status = 'Chưa kích hoạt'
                }
                else { lecturer.status = 'Đã kích hoạt'}
                lecturer.createdAt = moment(lecturer.createdAt).format("DD/MM/YYYY");
                lecturer.dob = moment(lecturer.dob).format("DD/MM/YYYY");
                res.render('vwAdmin/ManageUser/editLecturer', {
                    layout: "admin",
                    lecturer
                });
            })
            .catch(next)      
    }

    editCourse(req, res, next) {
        var lecturers;
        User.find({})
            .then(lecturerDB => {
                lecturers = multipleMongooseToObject(lecturerDB) 
                lecturers = userService.getInforLecturer(lecturers)
            })
            .catch(next);
        Course.findOne({ _id: req.params.id })
            .then(courseDB => {
                let course = mongooseToObject(courseDB);
                course = courseService.getLecturerName(course);
                course = courseService.getCategoryName(course);
                course.createdAt = moment(course.createdAt).format("DD/MM/YYYY");
                course.updatedAt = moment(course.updatedAt).format("DD/MM/YYYY");
                if (course.status === false) {
                    course.status = 'Chưa hoàn thành'
                }
                else course.status = 'Hoàn thành'
                res.render('vwAdmin/ManageProduct/editCourse', {
                    layout: "admin",
                    course,
                    lecturers: courseService.getListLectNameForCb(course.lecId,lecturers)
                });
            })
            .catch(next);
    }
}

module.exports = new AdminController();
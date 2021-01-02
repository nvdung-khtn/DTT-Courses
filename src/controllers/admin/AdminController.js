const Course = require('../../models/Course');
const User = require('../../models/User');
const moment = require('moment');
const courseService = require('../course/courseService');
const userService = require('../user/userService');
const fieldService = require('../../controllers/field/fieldService')
const { multipleMongooseToObject, mongooseToObject } = require('../../utils/mongoose');
const Field = require('../../models/Field')
const Category = require('../../models/Category');
const Swal = require('sweetalert2');
const bcrypt = require('bcryptjs');

const SALT = 10;


class AdminController {
    // [GET] /home
    index(req, res) {
        var students = [], lecturers = [], courses = [];
        User.find({})
            .then(usersDB => {
                let users = multipleMongooseToObject(usersDB);
                students = userService.getInforStudent(users);
                lecturers = userService.getInforLecturer(users);
            })
        Course.find({})
            .then(courseDB => {
                courses = multipleMongooseToObject(courseDB);
            })
        console.log(students.length);
        res.render('vwAdmin/index', {
            layout: "admin",
            students,
            lecturers,
            courses

        });
    }

    manageCategory(req, res) {
        res.render('vwAdmin/ManageProduct/category', {
            layout: "admin",
        });
    }

    manageProduct(req, res, next) {
        res.render('vwAdmin/ManageProduct/qlsp', {
            layout: "admin",
            courses
        });
    }


    // ---------------MANAGE STUDENT-----------------------

    async manageStudent(req, res) {
        const students = await User.find({permission:2}).lean();
        userService.convertStatusToStatusStringUsers(students);
        res.render('vwAdmin/ManageUser/student', {
            layout: "admin",
            students
        })
    }

    updateStudent(req, res, next) {
        const userData = {
            name : req.body.name,
            email : req.body.email,
            dob : moment(req.body.dob).toDate(),
            phone : req.body.phone,
            address: req.body.address,
            status : req.body.status,
            updatedAt : moment().toDate()
        };
        User.findOneAndUpdate({_id : req.body.id}, userData)
            .then(() => {    
                res.redirect('/admin/student');
            })
            .catch(next);
    }

    deleteStudent(req, res, next) {
        User.findByIdAndRemove(req.params.id)
        .then(() => {
            res.redirect('/admin/student');
        })
        .catch(next);
    }

    async editStudent(req, res) {
        const student = await User.findOne({_id: req.params.id}).lean();
        userService.convertStatusToStatusStringUser(student)
        student.dob = moment(student.dob).format("DD/MM/YYYY");
        student.createdAt = moment(student.createdAt).format("DD/MM/YYYY");
        student.totalCourse =  student.courseArr.length;
        res.render('vwAdmin/ManageUser/editUser', {
            layout: "admin",
            student,
        });
    }


    // ---------------MANAGE LECTURER-----------------------
    async manageLecturer(req, res) {
        const lecturers = await User.find({permission:1}).lean();
        userService.convertStatusToStatusStringUsers(lecturers);
        res.render('vwAdmin/ManageUser/lecturer', {
            layout: "admin",
            lecturers
        })
    }

    async editLecturer(req, res) {
        const lecturer = await User.findOne({_id: req.params.id}).lean();
        userService.convertStatusToStatusStringUser(lecturer)
        lecturer.dob = moment(lecturer.dob).format("DD/MM/YYYY");
        lecturer.createdAt = moment(lecturer.createdAt).format("DD/MM/YYYY");
        if (lecturer.courseArr) {
            lecturer.totalCourse =  lecturer.courseArr.length;
        } else {
            lecturer.totalCourse =  0;
        }
        
        res.render('vwAdmin/ManageUser/editLecturer', {
            layout: "admin",
            lecturer,
        });
    }

    updateLecturer(req, res, next) {
        const userData = {
            name : req.body.name,
            email : req.body.email,
            dob : moment(req.body.dob).toDate(),
            phone : req.body.phone,
            address: req.body.address,
            createdAt : moment(req.body.createAt).toDate(),
            status : req.body.status
        };
        console.log(userData);
        User.findOneAndUpdate({_id : req.body.id}, userData)
            .then(() => {    
                res.redirect('/admin/lecturer');
            })
            .catch(next);
    }

    addViewLecturer(req, res) {
        res.render('vwAdmin/ManageUser/addLecturer', {
            layout: "admin",
        })
    }

    addLecturer (req, res, next) {
        const hash = bcrypt.hashSync(req.body.password, SALT);
        const userData = {
            name : req.body.name,
            email : req.body.email,
            password : hash,
            dob : moment(req.body.dob).toDate(),
            phone : req.body.phone,
            address: req.body.address,
            card: [],
            permission : 1,
            createdAt : moment().toDate(),
            status : req.body.status,
            courseArr : []
        };
        User.create(userData)
            .then(() => {
                res.redirect('/admin/lecturer');
            })
            .catch(next);
    }
    

// ---------------MANAGE COURSES-----------------------


    editCourse(req, res, next) {
        // Course.findOne({ _id: req.params.id })
        //     .then(async courseDB => {
        //         let course = mongooseToObject(courseDB);
        //         course.fieldName = await fieldService.getFieldName(course.fieldId);
        //         course.lecName = await courseService.getLecturerName(course.lecId);
        //         const lecturers = await courseService.getListLectNameForCb(course.lecId);
        //         course.createdAt = moment(course.createdAt).format("DD/MM/YYYY");
        //         course.updatedAt = moment(course.updatedAt).format("DD/MM/YYYY");
        //         if (course.status === false) {
        //             course.status = 'Chưa hoàn thành';
        //         }
        //         else course.status = 'Hoàn thành';

                res.render('vwAdmin/ManageProduct/editCourse', {
                    layout: "admin",
                    //course
                });
            // })
            // .catch(next);
    }




}

module.exports = new AdminController();
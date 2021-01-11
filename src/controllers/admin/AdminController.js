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
const PAGE_SIZE = 2;
var page;
var status;


class AdminController {
    // [GET] /home
    async index(req, res) {
        const students = await User.find({permission:2}).lean();
        const lecturers = await User.find({permission:1}).lean();
        const courses = await Course.find().lean();
        const category = await Category.find().lean()
        res.render('vwAdmin/index', {
            layout: "admin",
            students,
            lecturers,
            courses,
            category
        });
    }



    // ---------------MANAGE STUDENT-----------------------

    async manageStudent(req, res) {
        page = req.query.page;
        var stringSearch = req.query.search;
        if (page) {
            page = parseInt(page);
            if (page<1) {
                page = 1;
            }
            const totalStudent = await User.countDocuments({permission:2});
            const totalPage = Math.ceil(totalStudent/PAGE_SIZE);
            if (page > totalPage) {
                page = totalPage;
            }
            const page_items = [];
            for ( var i = 1; i <= totalPage; i++) {
                const item = {
                    value : i
                }
                page_items.push(item);
            }
            var skip = (page - 1)*PAGE_SIZE;
            const students = await User.find({permission:2})
                .skip(skip)
                .limit(PAGE_SIZE).lean();
            userService.convertStatusToStatusStringUsers(students);
            return res.render('vwAdmin/ManageUser/student', {
                layout: "admin",
                students,
                page_items,
                prev_page : page - 1,
                next_page : page + 1,
                can_go_prev : (page <= 1),
                can_go_next : (page >= totalPage),
                disable_page : false
            })
        }
        if (stringSearch) {
            const students = await User.find({$text: {$search: stringSearch},permission:2}).lean();
            userService.convertStatusToStatusStringUsers(students); 
            return res.render('vwAdmin/ManageUser/student', {
                layout: "admin",
                students,
                empty: students.length === 0,
                stringSearch,
                disable_page : true
            })
        }

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
                res.redirect(`/admin/student?page=${page}`);
            })
            .catch(next);
    }

    deleteStudent(req, res, next) {
        User.findByIdAndRemove(req.params.id)
        .then(() => {
            res.redirect(`/admin/student?page=${page}`);
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
            page
        });
    }


    // ---------------MANAGE LECTURER-----------------------
    async manageLecturer(req, res) {
        page = req.query.page;
        var stringSearch = req.query.search;
        if (page) {
            page = parseInt(page);
            if (page<1) {
                page = 1;
            }
            const totalLecturer = await User.countDocuments({permission:1});
            const totalPage = Math.ceil(totalLecturer/PAGE_SIZE);
            if (page > totalPage) {
                page = totalPage;
            }
            const page_items = [];
            for ( var i = 1; i <= totalPage; i++) {
                const item = {
                    value : i
                }
                page_items.push(item);
            }
            var skip = (page - 1)*PAGE_SIZE;
            const lecturers = await User.find({permission:1})
                .skip(skip)
                .limit(PAGE_SIZE).lean();
            userService.convertStatusToStatusStringUsers(lecturers);
            return res.render('vwAdmin/ManageUser/lecturer', {
                layout: "admin",
                lecturers,
                page_items,
                prev_page : page - 1,
                next_page : page + 1,
                can_go_prev : (page <= 1),
                can_go_next : (page >= totalPage),
                disable_page : false
            })
        }
        if (stringSearch) {
            const lecturers = await User.find({$text: {$search: stringSearch},permission:1}).lean();
            userService.convertStatusToStatusStringUsers(lecturers); 
            return res.render('vwAdmin/ManageUser/lecturer', {
                layout: "admin",
                lecturers,
                empty: lecturers.length === 0,
                stringSearch,
                disable_page : true
            })
        }
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
            page
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
                res.redirect(`/admin/lecturer?page=${page}`);
            })
            .catch(next);
    }

    deleteLecturer(req, res, next) {
        User.findByIdAndRemove(req.params.id)
        .then(() => {
            res.redirect(`/admin/lecturer?page=${page}`);
        })
        .catch(next);
    }

    addViewLecturer(req, res) {
        res.render('vwAdmin/ManageUser/addLecturer', {
            layout: "admin",
        })
    }

    async addLecturer (req, res, next) {
        const checkEmail = await User.exists({email: req.body.email})
        if (checkEmail) {
            Swal.fire({
                title: 'SUCCESS!',
                text: 'Thank you for your information!',
                icon: 'success',
                confirmButtonText: 'Close'
              })
            res.redirect('/admin/lecturer/add');
        } else {

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
                    res.redirect(`/admin/lecturer?page=${page}`);
                })
                .catch(next);
        }
    }
    

// ---------------MANAGE COURSES-----------------------

    async manageCourse(req, res) {
        page = req.query.page;
        var stringSearch = req.query.search;
        if (page) {
            page = parseInt(page);
            if (page<1) {
                page = 1;
            }
            const totalCourse = await Course.countDocuments();
            const totalPage = Math.ceil(totalCourse/PAGE_SIZE);
            if (page > totalPage) {
                page = totalPage;
            }
            const page_items = [];
            for ( var i = 1; i <= totalPage; i++) {
                const item = {
                    value : i
                }
                page_items.push(item);
            }
            var skip = (page - 1)*PAGE_SIZE;
            const courses = await Course.find()
                .skip(skip)
                .limit(PAGE_SIZE).lean();
            courseService.convertStatusToStatusStringCourses(courses);
            return res.render('vwAdmin/ManageProduct/courses', {
                layout: "admin",
                courses,
                page_items,
                prev_page : page - 1,
                next_page : page + 1,
                can_go_prev : (page <= 1),
                can_go_next : (page >= totalPage),
                disable_page : false
            })
        }
        if (stringSearch) {
            const courses = await Course.find({$text: {$search: stringSearch}}).lean();
            courseService.convertStatusToStatusStringCourses(courses); 
            return res.render('vwAdmin/ManageProduct/courses', {
                layout: "admin",
                courses,
                empty: courses.length === 0,
                stringSearch,
                disable_page : true
            })
        }
    }

    async editCourse(req, res) {
        const course = await Course.findOne({_id : req.params.id}).lean();
        await courseService.getDetailCourse(course);
        const fields = await Field.find({_id : {$ne: course.fieldId}}).lean();
        const lecturers = await User.find({_id : {$ne: course.lecId}, permission: 1}).lean();
        courseService.convertStatusToStatusStringCourse(course);
        course.createdAt = moment(course.createdAt).format("DD/MM/YYYY");
        res.render('vwAdmin/ManageProduct/editCourse', {
            layout: "admin",
            course,
            fields,
            lecturers,
            page
        });
    }

    updateCourse(req, res, next) {
        const userData = {
            name : req.body.name,
            fieldId : req.body.field,
            tinyDes : req.body.tinyDes,
            lecId : req.body.lecId,
            currentPrice : req.body.currentPrice.replace(/\D/g, ''),
            status : req.body.status,
            updatedAt : moment().toDate()
        };
        Course.findOneAndUpdate({_id : req.body.id}, userData)
            .then(() => {    
                res.redirect(`/admin/course?page=${page}`);
            })
            .catch(next);
    }

    deleteCourse(req, res, next) {
        Course.findByIdAndRemove(req.params.id)
        .then(() => {
            res.redirect(`/admin/course?page=${page}`);
        })
        .catch(next);
    }


// ---------------MANAGE CATEGORY-----------------------

    async manageField(req, res) {
        page = req.query.page;
        var stringSearch = req.query.search;
        if (page) {
            page = parseInt(page);
            if (page<1) {
                page = 1;
            }
            const totalField = await Field.countDocuments();
            const totalPage = Math.ceil(totalField/PAGE_SIZE);
            if (page > totalPage) {
                page = totalPage;
            }
            const page_items = [];
            for ( var i = 1; i <= totalPage; i++) {
                const item = {
                    value : i
                }
                page_items.push(item);
            }
            var skip = (page - 1)*PAGE_SIZE;
            const fields = await Field.find()
                .skip(skip)
                .limit(PAGE_SIZE).lean();
            await courseService.getCatNameForFields(fields);
            return res.render('vwAdmin/ManageProduct/category', {
                layout: "admin",
                fields,
                page_items,
                prev_page : page - 1,
                next_page : page + 1,
                can_go_prev : (page <= 1),
                can_go_next : (page >= totalPage),
                disable_page : false
            })
        }
        if (stringSearch) {
            const fields = await Field.find({$text: {$search: stringSearch}}).lean();
            courseService.convertStatusToStatusStringCourses(fields); 
            return res.render('vwAdmin/ManageProduct/category', {
                layout: "admin",
                fields,
                empty: fields.length === 0,
                stringSearch,
                disable_page : true
            })
        }
    }

    deleteField( req, res, next) {
            Field.findByIdAndRemove(req.params.id)
            .then(() => {
                res.redirect('/admin/category?page=1');
            })
            .catch(next);
    }

    


}

module.exports = new AdminController();
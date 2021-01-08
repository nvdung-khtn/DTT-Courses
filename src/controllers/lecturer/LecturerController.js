const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Course = require('../../models/Course');
const Field = require('../../models/Field');
const courseService = require('../course/courseService');
const { mongooseToObject, multipleMongooseToObject } = require('../../utils/mongoose');

class LecturerController {
    // [GET] /
    index(req, res, next) {
        Course.find({})
            .then(async coursesDB => {
                // convert Mongoose Object to Object Literals
                const courses = await courseService.getInforCourses(multipleMongooseToObject(coursesDB));
                
                res.render('vwLecturer/manageCourses', {
                    courses,
                    layout: 'lecturer',
                });
            })
            .catch(next);
    }

    showProfile(req, res) {
        res.render('vwLecturer/manageProfile', {
            layout: 'lecturer',
        });
    }

    // [GET] lecturer/courses/create
    create(req, res, next) {
        // fake userId
        const userId = mongoose.Types.ObjectId('5fdb468941c10b2570a7cd35');
        Field.find()
            .then(fieldsDB => {
                res.render('vwLecturer/createCourse', {
                    layout: 'lecturer',
                    userId,
                    fields: multipleMongooseToObject(fieldsDB)
                });
            })
            .catch(next)
    }

    // [POST] lecturer/courses/store
    store(req, res, next) {
        let formData;
        let avatar, introVideo;
        const folderName = (Date.now() + Math.floor(Math.random() * 1000)).toString();
        const folderAddress = `./src/public/products/${folderName}`

        // Create folder to save new course.
        fs.mkdir(path.join('./src/public/products/', folderName), (err) => { 
            if (err) { 
                return console.error(err); 
            }
            console.log('Tạo thư mục thành công.'); 
        });
        fs.mkdir(path.join(`${folderAddress}`, 'videos'), err => next);
        fs.mkdir(path.join(`${folderAddress}`, 'images'), err => next);

        // Handle upload file
        const storage = multer.diskStorage({
            destination: function (req, file, callback) {
                if(file.fieldname === 'avatar') {
                    callback(null, `${folderAddress}/images`);
                } else {
                    callback(null, `${folderAddress}/videos`); //save video
                }
            },
            filename: function (req, file, callback) {
                if(file.fieldname === 'avatar') {
                    avatar = file.originalname;
                } else {
                    introVideo = file.originalname;
                }
                callback(null, file.originalname);
            },
        });

        const upload = multer({ storage });
        upload.fields([
            {
                name: 'avatar',
                maxCount: 1
            },
            {
                name: 'introVideo',
                maxCount: 1
            }
        ])(req, res, function (err) {
            formData = {
                ...req.body,
                folderAddress,
                avatar,
                introVideo,
                rating: 0,
                totalRating: 0,
                view: 0,
                students: [],
                lecId: "fake", //lấy trong session
                nIndex: 0,
                status: false,
            };

            if (err) {
                next(err);
            } else {
                console.log('Tạo khóa học thành công.');
                const course = new Course(formData);
                course
                    .save()
                    .then(() => {
                        
                        res.redirect('/lecturer/courses');
                    })
                    .catch(error => {});
            }
        });
    }

    // [GET] lecturer/courses/update
    updateCourse(req, res, next) {
        res.render('vwLecturer/updateCourse', {
            layout: 'lecturer'
        });
    }

    //[GET] lecturer/courses/lesson/:id
    editLesson(req, res, next) {
        res.render('vwLecturer/editLesson', {
            layout: 'lecturer'
        });
    }
}

module.exports = new LecturerController();

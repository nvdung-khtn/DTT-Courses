const multer = require('multer');
const fs = require('fs');
const path = require('path'); 
const Course = require('../../models/Course');
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

    // [GET] lecturer/course/create
    create(req, res, next) {
        res.render('vwLecturer/createCourse', {
            layout: 'lecturer',
        });
    }

    // [POST] lecturer/course/store
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
            console.log('Directory created successfully!'); 
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
            };

            if (err) {
                next(err);
            } else {
                console.log('Upload Image success');
                const course = new Course(formData);
                course
                    .save()
                    .then(() => res.redirect('/lecturer/courses'))
                    .catch(error => {});
            }
        });
    }
}

module.exports = new LecturerController();

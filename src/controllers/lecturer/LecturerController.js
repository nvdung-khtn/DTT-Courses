const multer = require('multer');
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
        let imgPath, videoPath;

        const storage = multer.diskStorage({
            destination: function (req, file, callback) {
                if(file.fieldname === 'imgPath') {
                    callback(null, './src/public/image/products/');
                } else {
                    callback(null, './src/public/image/login/'); //Luu video
                }
            },
            filename: function (req, file, callback) {
                if(file.fieldname === 'imgPath') {
                    imgPath = file.originalname;
                } else {
                    videoPath = file.originalname;
                }
                callback(null, file.originalname);
            },
        });

        // const fileFilter = (req, file, cb)

        const upload = multer({ storage });
        //upload.single('fuMain')(req, res, function (err) {
        //upload.array('imgPath', 5)(req, res, function (err) {
        upload.fields([
            {
                name: 'videoPath',
                maxCount: 1
            },
            {
                name: 'imgPath',
                maxCount: 5
            }
        ])(req, res, function (err) {
            formData = {
                ...req.body,
                imgPath,
                videoPath
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

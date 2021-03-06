const multer = require('multer');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const mongoose = require('mongoose');
const Course = require('../../models/Course');
const Field = require('../../models/Field');
const courseService = require('../course/courseService');
const bcrypt = require('bcryptjs');
const userService = require('../../controllers/user/userService');
const { mongooseToObject, multipleMongooseToObject } = require('../../utils/mongoose');

const SALT = 10;

class LecturerController {
    // [GET] /
    index(req, res, next) {
        Course.find({})
            .then(async coursesDB => {
                // convert Mongoose Object to Object Literals
                const courses = await courseService.getInforCourses(
                    multipleMongooseToObject(coursesDB),
                );

                res.render('vwLecturer/manageCourses', {
                    courses: courseService.modifyCoursesByLecturer(courses),
                    layout: 'lecturer',
                    empty: courses.length === 0,
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
                    fields: multipleMongooseToObject(fieldsDB),
                });
            })
            .catch(next);
    }

    // [POST] lecturer/courses/store
    store(req, res, next) {
        let formData;
        let avatar, introVideo;
        const folderName = (Date.now() + Math.floor(Math.random() * 1000)).toString();
        const folderAddress = `./src/public/products/${folderName}`;

        // Create folder to save new course.
        fs.mkdir(path.join('./src/public/products/', folderName), err => {
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
                if (file.fieldname === 'avatar') {
                    callback(null, `${folderAddress}/images`);
                } else {
                    callback(null, `${folderAddress}/videos`); //save video
                }
            },
            filename: function (req, file, callback) {
                if (file.fieldname === 'avatar') {
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
                maxCount: 1,
            },
            {
                name: 'introVideo',
                maxCount: 1,
            },
        ])(req, res, async function (err) {
            const fieldId = req.body.fieldId;
            const field = await Field.findOne({_id: fieldId}).lean();
            console.log("field:", field.name);
            formData = {
                ...req.body,
                folderName,
                avatar,
                introVideo,
                quantityRating: 0,
                totalRating: 0,
                view: 0,
                students: [],
                lecId: req.session.authUser._id,
                nIndex: 0,
                status: false,
                fieldName: field.name,
            };
            console.log(formData);
            if (err) {
                next(err);
            } else {
                console.log('Tạo khóa học thành công.');
                console.log('formData: ', formData);
                const course = new Course(formData);
                course
                    .save()
                    .then(() => {
                        res.redirect('/lecturer/courses');
                    })
                    .catch(next);
            }
        });
    }

    // [GET] lecturer/courses/:slug
    async updateCourse(req, res, next) {
        const slug = req.params.slug;
        let key = req.query.key;
        // bad ways
        req.session.slug = slug;
        const course = await Course.findOne({ slug: slug }).lean();
        course.completed = courseService.countCompletedLesson(course.lessons);
        let lessons = course.lessons.map(lesson => {
            return {
                _id: lesson._id,
                index: lesson.index,
                lessonName: lesson.lessonName,
                updatedAt: moment(lesson.updatedAt).format('DD/MM/YYYY HH:mm'),
                video: lesson.video ? 'Đã cập nhập' : 'Chưa cập nhập',
                status: lesson.status ? 'Hoàn thành' : 'Chưa hoàn thành',
            };
        });

        //check key !== undefined
        if(key) {
            key = key.toLowerCase();
            lessons = lessons.filter(lesson => {
                return lesson.lessonName.toLowerCase().includes(key)
            });
        }
        
        res.render('vwLecturer/updateCourse', {
            layout: 'lecturer',
            course,
            lessons: courseService.sortByIndex(lessons),
            empty: lessons.length === 0,
        });
    }

    //[POST] lecturer/courses/lesson/add
    async addLesson(req, res, next) {
        let video, formData;
        const slug = req.session.slug;
        const course = await Course.findOne({ slug: slug });
        const folderAddress = `./src/public/products/${
            mongooseToObject(course).folderName
        }`;

        // Handle upload file
        const storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, `${folderAddress}/videos`);
            },
            filename: function (req, file, callback) {
                video = file.originalname;
                callback(null, file.originalname);
            },
        });

        const upload = multer({ storage });
        upload.single('video')(req, res, function (err) {
            formData = {
                ...req.body,
                video,
                status: video === undefined ? false : true,
            };

            if (err) {
                next(err);
            } else {
                course.lessons.push(formData);
                course
                    .save()
                    .then(() => {
                        console.log('them bai giang thanh cong');
                        res.redirect('back');
                    })
                    .catch(next);
            }
        });
    }

    //[POST] lecturer/courses/lesson/del/:id
    async deleteLesson(req, res, next) {
        const id = req.params.id;
        const slug = req.session.slug;
        const course = await Course.findOne({ slug: slug }).then(course => {
            course.lessons.id(id).remove();
            //course.child.remove();
            course.status = false;
            course.save().then(() => res.redirect('back'));
        });
    }

    //[POST] lecturer/courses/lesson/edit/:id
    async editLesson(req, res, next) {
        const id = req.params.id;
        const slug = req.session.slug;
        let video, formData
        const course = await Course.findOne({ slug: slug });
        const folderAddress = `./src/public/products/${
            mongooseToObject(course).folderName
        }`;

        // Handle upload file
        const storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, `${folderAddress}/videos`);
            },
            filename: function (req, file, callback) {
                video = file.originalname;
                callback(null, file.originalname);
                //Xử lý đoạn đã upload video, chỉ sửa tên bài giảng
                if(!video) {
                    console.log('video', video);
                    video = oldVideo;
                }
            },
        });

        const upload = multer({ storage });
        upload.single('video')(req, res, function (err) {
            let lesson = course.lessons.id(id);
            console.log("lesson", lesson);
            if(!video) {
                video = lesson.video;
            }
            formData = {
                ...req.body,
                video,
                status: video === undefined ? false : true,
            };

            if (err) {
                next(err);
            } else {
                // let lesson = course.lessons.id(id);
                lesson.lessonName = formData.lessonName;
                lesson.video = formData.video;
                lesson.status = formData.status;
                course
                    .save()
                    .then(() => {
                        console.log('Cập nhập bài giảng thành công');
                        res.redirect('back');
                    })
                    .catch(next);
            }
        });
    }

    //[GET] lecturer/courses/:slug/verify
    verify(req, res, next) {
        const courseId = req.params.slug;
        Course.findOne({_id: courseId})
            .then(course => {
                const completedLesson = courseService.countCompletedLesson(course.lessons);
                if(course.quantity == completedLesson) {
                    course.status = true;
                    course.save();
                    return res.json({ status: true });
                }

                res.json({ status: false });
            })
    }

    //[POST] lecturer/courses/delete/:id
    deleteCourse(req, res, next) {
        const courseId = req.params.id;
        Course.deleteOne({_id: courseId})
            .then(() => res.redirect('back'))
            .catch(next)
    }

    changePassword(req, res) {
        res.render('vwLecturer/changePassword', {
            layout: 'lecturer'
        });
    }
    async updateProfile(req, res, next ){
        
        const data = req.body;
        //console.log(data);
        const idUser = req.session.authUser._id;
        data.id = idUser;

        await courseService.updateUserById(data.id, data);
            // cập nhật lại authUser;
        const newUser = await courseService.getUserById(data.id);
        if(newUser === null){
            console.log("Lỗi không thể lấy user_id");
            return res.redirect('/lecturer/profile');
        }   
        req.session.authUser = newUser;
        res.redirect('/lecturer/profile');

    }

    changepassword(req, res){
        res.render('vwLecturer/changePassword', {
            layout: 'lecturer',
        });
    }

    async postChangePassword(req, res){
        const data = req.body;
        const user = req.session.authUser;
       
        const ret = bcrypt.compareSync(data.oldpassword, user.password);
        //console.log(ret);
        if(ret === false) {
            console.log("Mật khẩu cũ không chính xác");
            const url = '/lecturer/changepassword/';
            return res.redirect(url)
        }
        if (data.newpassword.length < 6){
            console.log("Mật khẩu phải lớn hơn 6 kí tự");
            const url = '/lecturer/changepassword/';
            return res.redirect(url);
        }else if (data.newpassword !== data.confirmpassword){
            console.log("Mật khẩu không trùng khớp");
            const url = '/lecturer/changepassword/';
            return res.redirect(url);
        }

        const newpwHash = bcrypt.hashSync(data.newpassword, SALT);
        await userService.updatePasswordById(user._id, newpwHash);
        return res.redirect('/lecturer/profile');
    }
}

module.exports = new LecturerController();

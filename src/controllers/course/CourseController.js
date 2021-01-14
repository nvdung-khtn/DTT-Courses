const Course = require('../../models/Course');
const courseService = require('./courseService');
const { multipleMongooseToObject, mongooseToObject } = require('../../utils/mongoose');
const Comment = require('../../models/Comment');
const { getCommentBySlug } = require('./courseService');
const User = require('../../models/User');

class CourseController {
    // [GET] /courses
    index(req, res, next) {      
        Course.find({})
            .then(async coursesDB => {
                // convert Mongoose Object to Object Literals
                const courses = await courseService.getInforCourses(multipleMongooseToObject(coursesDB));
                res.render('home_fullCourse', {
                    courses
                });
            })
            .catch(next);
    }

    // [GET] /courses/:slug
    /*show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then( course => {
                Comment.find({ slug: req.params.slug })
                    .then( listComments => {
                        let listComment = multipleMongooseToObject(listComments);
                        listComment.forEach(element => {

                            // Lấy sao
                            if(element.rate === 1){
                                element.rate1 = true
                            } else if(element.rate === 2){
                                element.rate2 = true
                            } else if(element.rate === 3){
                                element.rate3 = true
                            } else if(element.rate === 4){
                                element.rate4 = true
                            } else if(element.rate === 5){
                                element.rate5 = true
                            }

                            // Lấy time
                            const check = Date.now() - element.date;
                            if( check <= 3600000 ){
                                element.time = Math.ceil(check / 60000) + ' phút';
                            }else if ( check <= 86400000){
                                element.time = Math.ceil(check / 3600000) + ' giờ';
                            }else if(check <= 604800000) {
                                element.time = Math.ceil(check / 86400000) + 'ngày';
                            }else if ( check <= 2629800000){
                                element.time = Math.ceil(check / 604800016) + ' tháng';
                            }else if(check > 2629800000) {
                                element.time = Math.ceil(check / 2629800000) + 'năm';
                            }
                        });
                        listComment.sort((a, b)=>{
                            return b.date - a.date;
                        })
                        res.render('vwCourse/detailCourse', {
                            course: mongooseToObject(course),
                            listComment
                    })
                })
            }
        }
    }*/
    async show(req, res, next) {
        req.session.slug = req.params.slug;
        const course = await Course.findOne({ slug: req.params.slug }).lean();
        const lecturer = await User.findOne({_id: course.lecId}).lean();
        const courses_lec = await Course.find({lecId: lecturer._id}).lean();
        lecturer.totalCourse = courses_lec.length;
        lecturer.totalStudent = 0;
        courses_lec.forEach(course_item => {
            if (course_item.students){
                lecturer.totalStudent += course_item.students.length;
            }
            
        })
        const lessons = course.lessons.map(lesson => {
            return {
                _id: lesson._id,
                index: lesson.index,
                name: lesson.lessonName,
                video: lesson.video,
            };
        });
        var listComment = await courseService.getCommentBySlug(req.params.slug); 
        listComment = multipleMongooseToObject(listComment);
        listComment.forEach(element => {

            // Lấy sao
            if(element.rate === 1){
                element.rate1 = true
            } else if(element.rate === 2){
                element.rate2 = true
            } else if(element.rate === 3){
                element.rate3 = true
            } else if(element.rate === 4){
                element.rate4 = true
            } else if(element.rate === 5){
                element.rate5 = true
            }

            // Lấy time
            const check = Date.now() - element.date;
            if( check <= 3600000 ){
                element.time = Math.ceil(check / 60000) + ' phút';
            }else if ( check <= 86400000){
                element.time = Math.ceil(check / 3600000) + ' giờ';
            }else if(check <= 604800000) {
                element.time = Math.ceil(check / 86400000) + 'ngày';
            }else if ( check <= 2629800000){
                element.time = Math.ceil(check / 604800016) + ' tháng';
            }else if(check > 2629800000) {
                element.time = Math.ceil(check / 2629800000) + 'năm';
            }
        });
        listComment.sort((a, b)=>{
            return b.date - a.date;
        })
        res.render('vwCourse/detailCourse', {
            layout: 'course',
            course,
            lessons,
            lesson: lessons[0],
            lecturer,
            listComment
        })

    }

    async videoCourse(req, res) {
        const slug = req.params.id.slice(0,req.params.id.indexOf('>'));
        const id = req.params.id.slice(req.params.id.indexOf('>')+1, req.params.id.length)

        const course = await Course.findOne({slug});
        const lesson = course.lessons.id(id);
        const lessons = course.lessons.map(lesson => {
            return {
                _id: lesson._id,
                index: lesson.index,
                name: lesson.lessonName,
                video: lesson.video,
            };
        });
        res.render('vwCourse/videoCourse', {
            layout: false,
            course: mongooseToObject(course),
            lessons,
            lesson: mongooseToObject(lesson)
        })
        
    }

    // exits index => true
    hasIndexLesson(req, res) {
        const data = req.body;

        Course.findOne({slug: data.slug})
            .then( course => course.lessons )
            .then (lessons => {
                let status = false;
                lessons.forEach(element => {
                    if(element.index == data.index) {
                        status = true;
                    }
                });
                console.log('status', status);
                res.json({status});
            })
    }

    postComment(req, res, next){
        if (!req.params.slug){
            return res.redirect('/');
        }
        const user = req.session.authUser;
        if(!user){
            return res.redirect('/account/login');
        }
        const data = req.body;
        //console.log(data);
        if(data.rating === undefined ){
            const url = '/courses/' + req.params.slug;
            return res.redirect(url);
        }
        
        const newdata = {
            email_user: user.email,
            name_user: user.name,
            date: Date.now(),
            slug: req.params.slug,
            cmt: data.comment,
            rate: parseInt(data.rating, 10), 
        }
        console.log(newdata);
        Comment.create(newdata)
            .then(() => {
                const url = '/courses/' + req.params.slug;
                return res.redirect(url);
            })
            .catch(next);
        // if(data.rate1 === 'on'){
        //     rate = 1;
        // }else if (data.rate2 === 'on'){
        //     rate = 2;
        // }else if(data.rate3 === 'on'){
        //     rate = 3;
        // }else if(data.rate4 === 'on'){
        //     rate = 4;
        // }else if(data.rate5 === 'on'){
        //     rate = 5;
        // }
        // if(rate === 0){
        //     const url = '/courses/' + req.params.slug;
        //     return res.redirect(url);
        // }
        // const newdata = {
        //     email_user: user.email,
        //     name_user: user.name,
        //     date: Date.now(),
        //     slug: req.params.slug,
        //     cmt: data.comment,
        //     rate, 
        // }
        // //console.log(rate);
        // Comment.create(newdata)
        //     .then( async () => {
        //         const url = '/courses/' + req.params.slug;
        //         return res.redirect(url);
        //     })
        //     .catch(next);
        const url = '/courses/' + req.params.slug;
        return res.redirect(url);
    }
}

module.exports = new CourseController();

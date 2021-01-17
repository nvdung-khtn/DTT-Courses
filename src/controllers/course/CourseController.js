const Course = require('../../models/Course');
const courseService = require('./courseService');
const { multipleMongooseToObject, mongooseToObject } = require('../../utils/mongoose');
const Comment = require('../../models/Comment');
const { getCommentBySlug } = require('./courseService');
const User = require('../../models/User');

const PAGE_SIZE = 8;
var page;

class CourseController {
    // [GET] /courses
    async index(req, res, next) {
        page = req.query.page;
        const stringSearch = req.query.search;
        const filter = req.query.sort;
        page = parseInt(page);
        if (page < 1) {
            page = 1;
        }

        var totalCourse = 0;
        if (!stringSearch) {
            totalCourse = await Course.countDocuments();
        } else {
            const courses_search = await Course.find({
                $text: { $search: stringSearch },
                status: true,
            }).lean();
            totalCourse = courses_search.length;
        }

        const totalPage = Math.ceil(totalCourse / PAGE_SIZE);

        if (page > totalPage) {
            page = totalPage;
        }
        const page_items = [];
        for (var i = 1; i <= totalPage; i++) {
            const item = {
                value: i,
            };
            page_items.push(item);
        }
        var skip = (page - 1) * PAGE_SIZE;

        var courses = [];
        if (totalPage !== 0) {
            if (!stringSearch) {
                courses = await Course.find().skip(skip).limit(PAGE_SIZE).lean();
            }
            if (stringSearch && !filter) {
                courses = await Course.find({
                    $text: { $search: stringSearch },
                    status: true,
                })
                    .skip(skip)
                    .limit(PAGE_SIZE)
                    .lean();
            }
            if (stringSearch && filter === 'index') {
                courses = await Course.find({
                    $text: { $search: stringSearch },
                    status: true,
                })
                    .sort({ nIndex: 1 })
                    .skip(skip)
                    .limit(PAGE_SIZE)
                    .lean();
            }
            if (stringSearch && filter === 'price') {
                courses = await Course.find({
                    $text: { $search: stringSearch },
                    status: true,
                })
                    .sort({ currentPrice: 1 })
                    .skip(skip)
                    .limit(PAGE_SIZE)
                    .lean();
            }
        }
        return res.render('home_fullCourse', {
            courses: await courseService.getInforCourses(courses),
            page_items,
            prev_page: page - 1,
            next_page: page + 1,
            can_go_prev: page <= 1,
            can_go_next: page >= totalPage,
            stringSearch,
            empty: courses.length === 0,
            filter,
        });
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
        const lecturer = await User.findOne({ _id: course.lecId }).lean();
        const courses_lec = await Course.find({ lecId: lecturer._id }).lean();
        lecturer.totalCourse = courses_lec.length;
        lecturer.totalStudent = 0;
        courses_lec.forEach(course_item => {
            if (course_item.students) {
                lecturer.totalStudent += course_item.students.length;
            }
        });
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
            if (element.rate === 1) {
                element.rate1 = true;
            } else if (element.rate === 2) {
                element.rate2 = true;
            } else if (element.rate === 3) {
                element.rate3 = true;
            } else if (element.rate === 4) {
                element.rate4 = true;
            } else if (element.rate === 5) {
                element.rate5 = true;
            }

            // Lấy time
            const check = Date.now() - element.date;
            if (check <= 3600000) {
                element.time = Math.ceil(check / 60000) + ' phút';
            } else if (check <= 86400000) {
                element.time = Math.ceil(check / 3600000) + ' giờ';
            } else if (check <= 604800000) {
                element.time = Math.ceil(check / 86400000) + 'ngày';
            } else if (check <= 2629800000) {
                element.time = Math.ceil(check / 604800016) + ' tháng';
            } else if (check > 2629800000) {
                element.time = Math.ceil(check / 2629800000) + 'năm';
            }
        });
        listComment.sort((a, b) => {
            return b.date - a.date;
        });
        res.render('vwCourse/detailCourse', {
            layout: 'course',
            course,
            lessons,
            lesson: lessons[0],
            lecturer,
            listComment,
        });
    }

    async videoCourse(req, res) {
        const slug = req.params.id.slice(0, req.params.id.indexOf('>'));
        const id = req.params.id.slice(
            req.params.id.indexOf('>') + 1,
            req.params.id.length,
        );

        const course = await Course.findOne({ slug });
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
            lesson: mongooseToObject(lesson),
        });
    }

    // exits index => true
    hasIndexLesson(req, res) {
        const data = req.body;

        Course.findOne({ slug: data.slug })
            .then(course => course.lessons)
            .then(lessons => {
                let status = false;
                lessons.forEach(element => {
                    if (element.index == data.index) {
                        status = true;
                    }
                });
                console.log('status', status);
                res.json({ status });
            });
    }

    async postComment(req, res, next) {
        const data = req.body;

        if (data.rating === undefined) {
            console.log('Vui lòng chọn sao đánh giá');
            const url = '/courses/' + req.params.slug;
            return res.redirect(url);
        }
        const user = req.session.authUser;
        if (!user) {
            return res.redirect('/account/login');
        }
        const newdata = {
            email_user: user.email,
            name_user: user.name,
            date: Date.now(),
            slug: req.params.slug,
            cmt: data.comment,
            rate: parseInt(data.rating, 10),
        };
        const courses = await courseService.getCourseBySlug(req.params.slug);
        //console.log(course);
        let totalRating = courses.totalRating;
        totalRating = totalRating + 1;
        //console.log(totalRating);
        const countStarRating = courses.quantityRating + parseInt(data.rating, 10);
        await courseService.updateRatingCourseBySlug(
            req.params.slug,
            totalRating,
            countStarRating,
        );
        Comment.create(newdata)
            .then(() => {
                const url = '/courses/' + req.params.slug;
                return res.redirect(url);
            })
            .catch(next);
    }

    countView(req, res) {
        const courseId = req.body.id;
        Course.findOne({ _id: courseId }).then(course => {
            const newView = course.view + 1;
            console.log("..",newView);
            Course.findOneAndUpdate({ _id: courseId }, { view: newView })
                .then(() => console.log("tăng view"))
        });
    }
}

module.exports = new CourseController();

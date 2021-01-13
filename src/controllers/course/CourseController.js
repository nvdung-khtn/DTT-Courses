const Course = require('../../models/Course');
const courseService = require('./courseService');
const { multipleMongooseToObject, mongooseToObject } = require('../../utils/mongoose');

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
    async show(req, res, next) {
        req.session.slug = req.params.slug;
        const course = await Course.findOne({ slug: req.params.slug }).lean();
        const lessons = course.lessons.map(lesson => {
            return {
                _id: lesson._id,
                index: lesson.index,
                name: lesson.lessonName,
                video: lesson.video,
            };
        });
        res.render('vwCourse/detailCourse', {
            layout: 'course',
            course,
            lessons,
            lesson: lessons[0],

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
}

module.exports = new CourseController();

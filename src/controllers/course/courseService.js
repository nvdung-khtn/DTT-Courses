const Course = require('../../models/Course');
const User = require('../../models/User');
const Category = require('../../models/Category');
const Field = require('../../models/Field');
const userService = require('../user/userService');
const Comment = require('../../models/Comment');
const { multipleMongooseToObject, mongooseToObject } = require('../../utils/mongoose');

module.exports = {

    convertStatusToStatusStringCourses(courses) {
        return courses.forEach(course => {
            const stringStatus = course.status === true ? "Đã hoàn thành" : "Chưa hoàn thành";
            course.stringStatus = stringStatus;
        });
    },

    convertStatusToStatusStringCourse(course) {
        const stringStatus = course.status === true ? "Đã hoàn thành" : "Chưa hoàn thành";
        course.stringStatus = stringStatus;
    },


    async getDetailCourse(course){
        const field = await Field.findOne({_id:course.fieldId}).lean();
        const category = await Category.findOne({_id:field.catId}).lean();
        const user = await User.findOne({_id:course.lecId}).lean();
        course.fieldName = field.name;
        course.catId = category._id;
        course.catName = category.name;
        course.lecName = user.name;
    },

    async getCatNameForFields(fields) {
        const categories = await Category.find().lean();
        fields.forEach(field => {
            categories.forEach(category => {
                if (category._id.equals(field.catId)) {
                    field.catName = category.name;
                }
            })

            if (field.courses) {
                field.totalCourse = field.courses.length;
            } else {
                field.totalCourse = 0;
            }
        })
    },

    async getCatNameForField(field) {
        const category = await Category.findOne({_id: field.catId}).lean();
        field.catName = category.name;
        if (field.courses) {
            field.totalCourse = field.courses.length;
        } else {
            field.totalCourse = 0;
        }
    },

    

    getListLectNameForCb(id, lecturers) {
        var lecs = [];
        for ( var i in lecturers) {
            if (!lecturers[i]._id.equals(id)) {
                lecs.push(lecturers[i]);
            }
        }
        return lecs;
    },

    getCategoryName(course){
        Field.findOne({_id: course.fieldId})
            .then(fieldDB => {
                let field = mongooseToObject(fieldDB);
                Category.findOne({_id: field.catId})
                    .then(categoryDB => {
                        let category = mongooseToObject(categoryDB);
                        course.catName = category.name;
                    })
            })
            return course;
    },


    async getInforCourse(course) {
        // return {
        //     ...course,
        //     lecName: 'lecturer.name',
        //     fieldName: 'field.name',
        // };
        const lecturer = await User.findById(course.lecId, 'name');
        const field = await Field.findById(course.fieldId, 'name');
        return {
            ...course,
            lecName: lecturer.name,
            fieldName: field.name,
        };
    },
    async getInforCourses(courses) {
        const ret = [];
        for(course of courses) {
            const result = await this.getInforCourse(course);
            ret.push(result);
        }
        
        return ret;
    },

    modifyCoursesByLecturer(courses) {
        return courses.map(course => {
            return {
                ...course,
                active: course.status ? "active" : "",
                statusString: course.status ? "Đã hoàn thành" : "Chưa hoàn thành"
            }
        });
    },

    countCompletedLesson(lessons) {
        let count = 0;
        lessons.forEach(lesson => {
            if(lesson.status) {
                count += 1;
            }
        })
        return count;
    },

    sortByIndex(lessons) {
        return lessons.sort((lessonA, lessonB) => lessonA.index - lessonB.index);
    },

    getCommentBySlug(slug){
        return Comment.find({slug: slug})
        .exec()
        .then((data)=> {
            return data;
        })
        .catch(err => err)
    },
}
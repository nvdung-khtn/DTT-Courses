const Course = require('../../models/Course');
const User = require('../../models/User');
const Category = require('../../models/Category');
const Field = require('../../models/Field');
const userService = require('../user/userService');
const { multipleMongooseToObject, mongooseToObject } = require('../../utils/mongoose');

module.exports = {
    getLecturerName(course){
        User.findOne({_id : course.lecId})
            .then(userDB => {
                let user = mongooseToObject(userDB);
                course.lecName = user.name;
            })
             return course;
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


    getInforCourse(course) {
        const lecName = this.getLecturerName(course.lecId);
        const fieldName = this.getFieldName(course.fieldId);

        return {
            ...course,
            lecName,
            fieldName,
        };
    },

    getInforCourses(courses) {
        return courses.map(course => {
            return course = this.getInforCourse(course);
        })
    }
}
const Course = require('../../models/Course');
const User = require('../../models/User');
const Category = require('../../models/Category');
const Field = require('../../models/Field');
const userService = require('../user/userService');
const { multipleMongooseToObject, mongooseToObject } = require('../../utils/mongoose');

module.exports = {
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
        return {
            ...course,
            lecName: 'lecturer.name',
            fieldName: 'field.name',
        };
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
    }
}
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
        const courses = await Course.find().lean();
        const categories = await Category.find().lean();
        fields.forEach(field => {
            categories.forEach(category => {
                if (category._id.equals(field.catId)) {
                    field.catName = category.name;
                }
            })

            field.totalCourse = 0;
            courses.forEach(course => {
                if (course.fieldId.equals(field._id)) {
                    field.totalCourse += 1;
                }
            })
        })
    },

    async getCatNameForField(field) {
        const category = await Category.findOne({_id: field.catId}).lean();
        field.catName = category.name;
        const courses = await Course.find({fieldId: field._id}).lean();
        field.totalCourse = courses.length;
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
        const lecturer = await User.findById(course.lecId, 'name');
        const field = await Field.findById(course.fieldId, 'name');
        const initialPrice = course.initialPrice;
        const currentPrice = course.currentPrice;

        // Tính điểm rating
        let ratingPoint = 0;
        if(course.totalRating) {
            ratingPoint = (course.quantityRating / course.totalRating).toFixed(1);
        }

        // Tính phần trăm giảm giá
        let saleOffPercent = 0;
        if(currentPrice) {
            saleOffPercent = Math.round(((initialPrice - currentPrice) / initialPrice) * 100);
        }
        console.log(saleOffPercent);

        return {
            ...course,
            lecName: lecturer.name,
            fieldName: field.name,
            ratingPoint,
            saleOffPercent
        };
    },
    // Thêm tên lính vực và tên giảng viên
    async getInforCourses(courses, ids = []) {
        const ret = [];
        for(course of courses) {
            ids.push(course._id);
            const result = await this.getInforCourse(course);
            ret.push(result);
        }
        
        return ret;
    },

    getEveRating(courses) {
        courses.forEach(course => {
            if (course.quantityRating===0 && course.totalRating===0) {
                course.eveRating = 0
            } else {
                course.eveRating = Math.round((course.quantityRating/course.totalRating) * 100) / 100;
            }
            
        })
    },
    getSumIndex(courses) {
        courses.forEach(course => {
            course.nIndex = course.view*2 + course.quantityRating + course.totalRating;
            Course.findOneAndUpdate({_id: course._id},{nIndex: course.nIndex})
                .then(()=>{
                })

        })
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

    getUserById(id){
        return User.find({_id: id})
        .exec()
        .then((data)=> {
            if (data.length > 0 ){
                return data[0]; //user object
            }
            return null;
        })
        .catch(err => err)
    },

    updateUserById: (id, data ) => {
        return User.updateOne({_id: id }, {$set: {name: data.name, address: data.address, email: data.email, phone: data.phone}})
        .exec()
        .then(()=> {
            console.log("Update success");
        })
        .catch(err => {
            return 'err'
        })
    },

    getCourseBySlug: (slug) => {
        return Course.find({slug})
        .exec()
        .then((data)=> {
            if (data.length > 0 ){
                return data[0]; //user object
            }
            return null;
        })
        .catch(err => err)
    },

    updateRatingCourseBySlug: (slug, totalRating, countStarRating) => {
        return Course.updateOne({slug: slug }, {$set: {totalRating: totalRating, quantityRating: countStarRating}})
        .exec()
        .then(()=> {
            console.log("Update total rating course success");
        })
        .catch(err => {
            return 'err'
        })
    }
}
const courseService = require('../course/courseService');

module.exports = {
    getHighLightCourse: function (courses) {
        let hightLightCourse = courses.filter(function (course) {
            return course.nIndex === 1; //update late
        });

        return hightLightCourse.map(function (course) {
            return courseService.getInforCourse(course);
        });
    },

    getMostViewedCourse: function (courses, n) {
        let ret = courses.sort(function (courseA, courseB) {
            return courseB.view - courseA.view;
        });

        return ret.slice(0,n).map(function (course) {
            return courseService.getInforCourse(course);
        });
    },

    getNewCourse: function (courses, n) {
        let ret = courses.sort(function (courseA, courseB) {
            // return number && date lớn => number lớn.
            const dateA = courseA.createdAt.getTime();
            const dateB = courseB.createdAt.getTime();
            return dateB - dateA;
        });

        return ret.slice(0,n).map(function (course) {
            return courseService.getInforCourse(course);
        });
    },
};

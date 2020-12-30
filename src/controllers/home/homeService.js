const courseService = require('../course/courseService');

module.exports = {
    getHighLightCourse: (courses, n) => {
        let ret = courses.sort(function (courseA, courseB) {
            return courseB.nIndex - courseA.nIndex;
        });
        
        return ret.slice(0,n);
    },

    getMostViewedCourse: function (courses, n) {
        let ret = courses.sort(function (courseA, courseB) {
            return courseB.view - courseA.view;
        });

        return ret.slice(0,n);
    },

    getNewCourse: function (courses, n) {
        let ret = courses.sort(function (courseA, courseB) {
            // return number && date lớn => number lớn.
            const dateA = courseA.createdAt.getTime();
            const dateB = courseB.createdAt.getTime();
            return dateB - dateA;
        });

        return ret.slice(0,n);
    },
};

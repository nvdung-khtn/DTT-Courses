module.exports = { 
    filterMostViewedCourse: function (courses) {
        courses.sort(function(courseA, courseB) {   
            return courseB.view - courseA.view;
        })

        return courses.slice(0, 5);
    },

    filterNewCourse: function (courses) {
        courses.sort(function(courseA, courseB) {
            // return number && date lớn => number lớn.
            const dateA = courseA.createdAt.getTime();
            const dateB = courseB.createdAt.getTime();
            return dateB - dateA;
        })

        return courses.slice(0, 5);
    }
}
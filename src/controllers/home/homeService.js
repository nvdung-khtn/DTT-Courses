module.exports = { 
    filterMostViewedCourse: function (courses) { //A < B
        courses.sort(function(courseA, courseB) {   
            return courseB.view - courseA.view;
        })

        return courses.slice(0, 5);
    }
}
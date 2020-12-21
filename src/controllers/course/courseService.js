module.exports = {
    getLecturerName(lecId){
        return 'Nguyễn Văn Dũng';
    },

    getFieldName(fieldId){
        return 'HTML && CSS';
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
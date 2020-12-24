

module.exports = {

    convertStatusToStatusString(users) {
        users.forEach(user => {
            const stringStatus = user.status === true ? "Đã kích hoạt" : "Vô hiệu hóa";
            user.stringStatus = stringStatus;
        });

        return users;
    },

    getInforLecturer(users) {
        var lecturers = [];
        for (var i in users) {
            if (users[i].permission === 1) {
                lecturers.push(users[i])
            }
        }
        return lecturers;
    },

    getInforStudent(users) {
        var students = [];
        for (var i in users) {
            if (users[i].permission === 2) {
                students.push(users[i])
            }
        }
        return students
    },

    getInfoTotalCourse(user) {
        console.log(user);
        user.totalCourse = user.courseArr.length;
        return user;
    }
}
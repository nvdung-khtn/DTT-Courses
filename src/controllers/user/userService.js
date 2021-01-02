

module.exports = {

    convertStatusToStatusStringUsers(users) {
        return users.forEach(user => {
            const stringStatus = user.status === true ? "Đã kích hoạt" : "Vô hiệu hóa";
            user.stringStatus = stringStatus;
        });
    },

    convertStatusToStatusStringUser(user) {
        const stringStatus = user.status === true ? "Đã kích hoạt" : "Vô hiệu hóa";
        user.stringStatus = stringStatus;
    },

    convertStatusToStatusBool(stringStatus) {
        const status = stringStatus === "Đã kích hoạt" ? 1 : 0;
        return status;
    },

    getInfoTotalCourse(user) {
        console.log(user);
        user.totalCourse = user.courseArr.length;
        return user;
    }
}
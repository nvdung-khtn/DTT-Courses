const User = require('../../models/User');
const Otp = require('../../models/Otp');


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

    updatePasswordById: (id, password ) => {
        return User.updateOne({_id: id }, {$set: {password: password}})
        .exec()
        .then(()=> {
            console.log("Đổi mật khẩu thành công");
        })
        .catch(err => {
            return 'err'
        })
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

    getUserByEmail(email){
        return User.find({email: email})
        .exec()
        .then((data)=> {
            if (data.length > 0 ){
                return false; //user object
            }
            return true;
        })
        .catch(err => err)
    },

    getOtpByEmail(email){
        return Otp.find({email: email })
        .exec()
        .then((data)=> {
            //console.log(data);
            return data[0].content;
        })
        .catch(err => {
            return 'err'
        })
    },

    deleteOtpByEmail: (email) => {
        return Otp.deleteMany({email: email})
        .exec()
        .then(()=> {
            console.log("Delete otp success");
        })
        .catch(err => {
            return 'err'
        })
    },

}
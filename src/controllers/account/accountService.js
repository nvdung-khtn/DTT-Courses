const Otp = require('../../models/Otp');
const User = require('../../models/User');

module.exports = {
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

    getUserByEmail(email){
        return User.find({email: email})
        .exec()
        .then((data)=> {
            if (data.length > 0 ){
                return data[0]; //user object
            }
            return null;
        })
        .catch(err => err)
    },

    findUserByEmail: (email) => {
        return User.find({email: email})
        .exec()
        .then((data)=> {
            if (data.length === 0 ){
                return true;
            }
            return false;
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
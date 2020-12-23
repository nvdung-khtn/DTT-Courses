const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
    password: String,
    name: String,
    email: String,
    dob: Date,
    address: String,
    phone: String,
    cart: [mongoose.ObjectId],
    permission: Number,
    courses: [mongoose.ObjectId],
    status: Boolean
}, {
    timestamps: true,
});

// Mongodb sẽ tự hiểu User => Users
module.exports = mongoose.model('User', User);

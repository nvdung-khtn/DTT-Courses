const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const courses = new Schema({
    id: String,
    name: String,
    quantityRating: Number,
    totalRating: Number,
    initialPrice: Number,
    currentPrice: Number,
    fieldId: String,
    lecId: String,
    folderName: String, 
    avatar: String,
    slug: String
}, {
    timestamps: true
});

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
    status: Boolean,
    favorCourse: [courses],
}, {
    timestamps: true,
});

// Mongodb sẽ tự hiểu User => Users
module.exports = mongoose.model('User', User);

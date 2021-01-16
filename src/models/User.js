const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const FavorCourse = new Schema({
    id: String,
    name: String,
    initialPrice: Number,
    currentPrice: Number,
    folderName: String,
    avatar: String,
    rating: Number,
    quantityRating: Number
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
    favorCourse: [FavorCourse]
}, {
    timestamps: true,
});

// Mongodb sẽ tự hiểu User => Users
module.exports = mongoose.model('User', User);

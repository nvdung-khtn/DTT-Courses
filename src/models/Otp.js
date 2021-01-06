const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Otp = new Schema({
    email: String,
    content: String,
    time: Number,
}, {
    timestamps: true,
});

// Mongodb sẽ tự hiểu User => Users
module.exports = mongoose.model('Otp', Otp);

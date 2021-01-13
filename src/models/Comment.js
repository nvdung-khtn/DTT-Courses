const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema({
    email_user: String,
    name_user: String,
    date: Number,
    slug: String,
    cmt: String,
    rate: Number, 
}, {
    timestamps: true,
});

// Mongodb sẽ tự hiểu User => Users
module.exports = mongoose.model('Comment', Comment);

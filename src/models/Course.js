const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);
const Lesson = new Schema({
    index: Number,
    lessonName: String,
    video: String,
    status: Boolean
}, {
    timestamps: true
});
const Course = new Schema({
    name: String,
    slug: { type: String, slug: "name", unique: true },
    rating: Number,
    tinyDes: String,
    totalRating: Number,
    folderName: String,
    avatar: String,
    introVideo: String,
    status: Boolean,
    view: Number,
    students: [mongoose.ObjectId],  // Định nghĩa mảng???
    lecId: mongoose.ObjectId,
    fieldId: mongoose.ObjectId,
    initialPrice: Number,
    currentPrice: Number,
    fullDes: String,
    nIndex: Number,
    quantity: Number,
    lessons: [Lesson]
}, {
    timestamps: true,
});

// Mongodb sẽ tự hiểu Course => courses
module.exports = mongoose.model('Course', Course);  //ts2: schemaName

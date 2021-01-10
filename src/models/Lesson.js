const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Lesson = new Schema({
    index: { type: Number, unique: true },
    lessonName: String,
    video: String,
    status: Boolean
}, {
    timestamps: true
});

// Mongodb sẽ tự hiểu Course => courses
module.exports = mongoose.model('Lesson', Lesson);  //ts2: schemaName

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);
const Course = new Schema({
    name: { type: String, require: true },
    description: { type: String},
    image: { type: String, maxLength: 255 },
    videoId: { type: String, require: true },
    slug: { type: String, slug: "name", unique: true },
}, {
    timestamps: true,
});

// Mongodb sẽ tự hiểu Course => courses
module.exports = mongoose.model('Course', Course);

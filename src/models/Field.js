const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Field = new Schema({
    name: String,
    catId: mongoose.ObjectId,
    courses: [mongoose.ObjectId],
}, {
    timestamps: true,
});

// Mongodb sẽ tự hiểu Field => Fields
module.exports = mongoose.model('Field', Field);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Category = new Schema({
    name: String,
    fields: [mongoose.ObjectId],
}, {
    timestamps: true,
});

// Mongodb sẽ tự hiểu Category => Categories
module.exports = mongoose.model('Category', Category);

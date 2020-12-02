const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/online_academy_dev', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log('Connect to DB successfully!!!');
    } catch (error) {
        console.log('Connect to DB failure!!!');
    }
}

module.exports = { connect };
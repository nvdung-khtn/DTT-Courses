const mongoose = require('mongoose');

const STRING_CONNECT = "mongodb://localhost:27017/online_academy_dev"
async function connect() {
    try {
        await mongoose.connect(STRING_CONNECT, {
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
const mongoose = require('mongoose');

const STRING_CONNECT = "mongodb+srv://nvdung-khtn:nvdung-khtn@cluster0.v0gm5.mongodb.net/online_academy_dev?retryWrites=true&w=majority"
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
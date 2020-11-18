// File điều hướng của ứng dụng
const loginRouter = require('./accountRoute/login.js');

function route(app) {
    app.use('/login', loginRouter);
}

module.exports = route;
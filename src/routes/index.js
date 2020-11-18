// File điều hướng của ứng dụng
const loginRouter = require('./accountRoute/login.js');
const registerRouter = require('./accountRoute/register.js');

function route(app) {
    app.use('/login', loginRouter);
    app.use('/register', registerRouter);
}

module.exports = route;
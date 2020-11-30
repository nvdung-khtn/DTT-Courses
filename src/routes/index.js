// File điều hướng của ứng dụng
const loginRouter = require('./accountRoute/login.js');
const registerRouter = require('./accountRoute/register.js');
const homeRouter = require('./home.js');
const adminRouter = require('./admin/admin.route');

function route(app) {
    app.use('/login', loginRouter);
    app.use('/register', registerRouter);
    app.use('/admin', adminRouter);
    app.use('/', homeRouter);
}

module.exports = route;
// File điều hướng của ứng dụng
const loginRouter = require('./account/login.route');
const registerRouter = require('./account/register.route');
const homeRouter = require('./home.route');
const adminRouter = require('./admin/admin.route');
const lecturerRouter = require('./lecturer/lecturer.route')

function route(app) {
    app.use('/login', loginRouter);
    app.use('/register', registerRouter);
    app.use('/admin', adminRouter);
    app.use('/', homeRouter);
    app.use('/lecturer',lecturerRouter);
}

module.exports = route;
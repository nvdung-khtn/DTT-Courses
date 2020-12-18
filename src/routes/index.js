// File điều hướng của ứng dụng
const loginRouter = require('./account/login.route');
const registerRouter = require('./account/register.route');
const homeRouter = require('./home.route');
const adminRouter = require('./admin/admin.route');
const lecturerRouter = require('./lecturer/lecturer.route');
const courseRouter = require('./course/course.route');

function route(app) {
    app.use('/login', loginRouter);
    app.use('/register', registerRouter);
    app.use('/admin', adminRouter);
    app.use('/lecturer',lecturerRouter);
    app.use('/course', courseRouter)
    app.use('/', homeRouter);
}

module.exports = route;
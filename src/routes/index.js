// File điều hướng của ứng dụng
const accountRouter = require('./account/account.route');
const courseRouter = require('./course/course.route');
const adminRouter = require('./admin/admin.route');
const lecturerRouter = require('./lecturer/lecturer.route');
const homeRouter = require('./home.route')


function route(app) {
    /** Route of Guest */
    app.use('/account', accountRouter);
    /** Route of Admin */
    app.use('/admin', adminRouter);
    /** Route of Lecturer */
    app.use('/lecturer',lecturerRouter);
    /** Route of User */
    app.use('/courses', courseRouter);
    
    /** Route Home page */
    app.use('/', homeRouter);
}

module.exports = route;
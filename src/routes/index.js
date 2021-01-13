// File điều hướng của ứng dụng
const accountRouter = require('./account/account.route');
const courseRouter = require('./course/course.route');
const adminRouter = require('./admin/admin.route');
const lecturerRouter = require('./lecturer/lecturer.route');
const homeRouter = require('./home.route');
const userRouter = require('./user/user.route');
const { auth, authAdmin, authUser, authLecturer} = require('../middleWares/auth.mdw');

function route(app) {
    /** Route of Guest */
    app.use('/account', accountRouter);
    /** Route of Admin */
    app.use('/admin', auth, authAdmin, adminRouter);
    /** Route of Lecturer */
    //app.use('/lecturer', auth, authLecturer, lecturerRouter);
    app.use('/lecturer', lecturerRouter);
    /** Route of User */
    app.use('/courses', courseRouter);
    /** Route of manage user */
    app.use('/user', userRouter);

    /** Route Home page */
    app.use('/', homeRouter);
}

module.exports = route;
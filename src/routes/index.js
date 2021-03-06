// File điều hướng của ứng dụng
const courseRouter = require('./course/course.route');
const accountRouter = require('./account/account.route');

const adminRouter = require('./admin/admin.route');
const lecturerRouter = require('./lecturer/lecturer.route');
const homeRouter = require('./home.route');
const userRouter = require('./user/user.route');
const { auth, authAdmin, authLecturer} = require('../middleWares/auth.mdw');

function route(app) {
    /** Route of Admin */
    app.use('/admin', authAdmin, adminRouter);
    
    /** Route of Lecturer */
    app.use('/lecturer', authLecturer, lecturerRouter);
    
    /** Route of User */
    app.use('/user', auth, userRouter);

    /** Route of Guest */
    app.use('/account', accountRouter);
    app.use('/', homeRouter);

}

module.exports = route;
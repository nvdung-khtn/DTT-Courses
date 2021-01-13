module.exports = function (app) {
    app.use(async function (req, res, next) {
        if (typeof req.session.isAuth === 'undefined') {
            req.session.isAuth = false;
        }

        if (typeof req.session.isAuthLecturer === 'undefined') {
            req.session.isAuthLecturer = false;
        }

        res.locals.isAuth = req.session.isAuth;
        res.locals.isAuthLecturer = req.session.isAuthLecturer;
        res.locals.authUser = req.session.authUser;
        next();
    });
};

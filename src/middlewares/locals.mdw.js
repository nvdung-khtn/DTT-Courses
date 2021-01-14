module.exports = function (app) {
    app.use(async function (req, res, next) {
        if (typeof req.session.isAuth === 'undefined') {
            req.session.isAuth = false;
            req.session.isAuthLecturer = false;
            req.session.isAuthAdmin = false;
            req.session.cart = []; 
        }

        res.locals.isAuth = req.session.isAuth;
        //res.locals.isAuth = true; ==> dành để testing
        res.locals.isAuthLecturer = req.session.isAuthLecturer;
        res.locals.isAuthAdmin = req.session.isAuthAdmin;
        // Số lượng khóa học trong giỏ hàng
        res.locals.cartSummary = req.session.cart.length;
        next();
    });
};

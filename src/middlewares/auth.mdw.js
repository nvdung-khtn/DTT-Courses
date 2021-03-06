
module.exports = {
    auth(req, res, next) {
        if (req.session.isAuth === false) {
            req.session.retUrl = req.originalUrl;
            return res.redirect('/account/login');
        }

        next();
    },

    authAdmin(req, res, next) {
        if (req.session.isAuthAdmin === false) {
            req.session.retUrl = req.originalUrl;
            return res.redirect('/account/login');
        }
        next();
    },

    authLecturer(req, res, next) {
        if (req.session.isAuthLecturer === false) {
            req.session.retUrl = req.originalUrl;
            return res.redirect('/account/login');
        }
        next();
    },

};

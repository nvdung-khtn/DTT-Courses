
module.exports = {
    auth(req, res, next) {
        if (req.session.isAuth === false) {
            req.session.retUrl = req.originalUrl;
            return res.redirect('/account/login');
        }

        next();
    },

    authAdmin(req, res, next) {
        const { permission } = req.session.authUser;
        if(permission !== 0) {
            return res.redirect('/');
        }

        next();
    },

    authUser(req, res, next){
      if (req.session.isAuth === false ) {
        req.session.retUrl = req.originalUrl;
        return res.redirect('/account/login');
      }
      if( req.session.authUser.permission !== 2){
        req.session.retUrl = req.originalUrl;
        return res.redirect('/account/login');
      }
    
      next();
    },

};

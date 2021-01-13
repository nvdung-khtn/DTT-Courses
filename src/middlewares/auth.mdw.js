
module.exports = {
    auth(req, res, next) {
        if (req.session.isAuth === false && req.session.isAuthLeturer === false) {
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

    authLecturer(req, res, next) {
        // if(req.session.authUser){
        //     const { permission } = req.session.authUser;
        //     if(permission !== 1) {
        //         return res.redirect('/');
        //     }
        // }
        // return res.redirect('/account/login')
        if (req.session.authUser === undefined){
            return res.redirect('/account/login')
        }
        const { permission } = req.session.authUser;
        
        if(permission !== 1) {
            return res.redirect('/');
        }
      

      next();
  },

    authUser(req, res, next){
        // if (req.session.isAuth === false) {
        //     req.session.retUrl = req.originalUrl;
        //     return res.redirect('/account/login');
        // }
        // if( req.session.authUser.permission !== 2){
        //     req.session.retUrl = req.originalUrl;
        //     return res.redirect('/account/login');
        // }
    
        next();
    },

};

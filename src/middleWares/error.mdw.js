module.exports = function (app) {
    app.use(function (req, res) {
        res.render('vwErrors/404', {
            layout: false,
        });
    });

    // default error handler
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.render('vwErrors/500', {
            layout: false,
        });
    });
};

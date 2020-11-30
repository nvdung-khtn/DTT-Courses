const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');
const numeral = require('numeral');
require('express-async-errors');

const PORT = 3000;
const app = express();

const route = require('./routes/index');

app.use(express.static(path.join(__dirname, 'public')));

// Middleware handle form data
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

// HTTP Logger
app.use(morgan('dev'));

// Template engine
app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Routes initialization
route(app);

app.use(function (req, res) {
    res.render('vwErrors/404', {
      layout: false
    })
});
// default error handler
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.render('vwErrors/500', {
      layout: false
    })
})

app.listen(PORT, () => {
    console.log(`Sever is running at port ${PORT}......`);
});

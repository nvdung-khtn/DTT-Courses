const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');
const numeral = require('numeral');
const hbs_sections = require('express-handlebars-sections');

const route = require('./routes/index');
const db = require('./config/db');
require('express-async-errors');

const PORT = 3000;
const app = express();

// connect to DB server
db.connect();

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
        helpers: { 
            section: hbs_sections(),
            format(value) {
                return numeral(value).format('0,0');
            }
        }
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

const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');
const numeral = require('numeral');
const hbs_sections = require('express-handlebars-sections');
const db = require('./config/db');
require('express-async-errors');

const PORT = process.env.PORT || 3000;
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
                return numeral(value).format('0,0') +' đ';
            }
        }
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

require('./middleWares/session.mdw')(app);
require('./middleWares/locals.mdw')(app);
require('./routes/index')(app);
require('./middleWares/error.mdw')(app);

app.listen(PORT, () => {
    console.log(`Sever is running at port ${PORT}......`);
});

const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');
const numeral = require('numeral');
const hbs_sections = require('express-handlebars-sections');
const session = require('express-session');
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
                return numeral(value).format('0,0') +' đ';
            }
        }
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'SECKET_KEY',
  resave: false,
  saveUninitialized: true,
  cookie: { 
      //secure: true 
    }
}))


app.use((req, res, next)=>{
    if(req.session.isAuth === null ){
        req.session.isAuth = false;
    }
    res.locals.isAuth = req.session.isAuth;
    res.locals.authUser = req.session.authUser;
    next();
})

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

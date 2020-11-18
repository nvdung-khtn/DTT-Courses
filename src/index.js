const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');
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
app.set('views', path.join(__dirname, 'resources', 'views'));

// Routes initialization
route(app);

app.listen(PORT, () => {
    console.log(`Sever is running at port ${PORT}......`);
});

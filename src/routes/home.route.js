const express = require('express');
const router = express.Router();

const accountRouter = require('./account/account.route');
const homeController = require('../controllers/home/homeController');
const courseController = require('../controllers/course/CourseController');

/** Route of Account */
router.use('/account', accountRouter);

router.get('/', homeController.index);
router.get('/courses/:slug', courseController.show);



module.exports = router;
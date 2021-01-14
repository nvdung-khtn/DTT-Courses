const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home/homeController');
const courseController = require('../controllers/course/CourseController');



router.get('/', homeController.index);
router.get('/courses/:slug', courseController.show);

module.exports = router;
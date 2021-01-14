const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home/homeController');
const courseController = require('../controllers/course/CourseController');

router.get('/courses/:slug', courseController.show);
router.get('/courses', courseController.index);
router.get('/', homeController.index);


module.exports = router;
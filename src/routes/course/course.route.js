const express = require('express');
const router = express.Router();

const courseController = require('../../controllers/course/CourseController');

router.get('/:slug', courseController.show);
router.get('/', courseController.index);
router.get('/video/1',courseController.videoCourse);


module.exports = router;

const express = require('express');
const router = express.Router();

const courseController = require('../../controllers/course/CourseController');

router.get('/:slug', courseController.show);
router.get('/', courseController.index);

module.exports = router;
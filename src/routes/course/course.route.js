const express = require('express');
const router = express.Router();

const courseController = require('../../controllers/course/CourseController');
const { route } = require('../user/user.route');

router.get('/:slug', courseController.show);
router.get('/', courseController.index);
router.post('/:slug', courseController.postComment)


module.exports = router;

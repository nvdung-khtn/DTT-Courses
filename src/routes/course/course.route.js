const express = require('express');
const router = express.Router();

const courseController = require('../../controllers/course/CourseController');
const { auth, authLecturer} = require('../../middleWares/auth.mdw');


router.get('/video/:id', auth, courseController.videoCourse);

router.post('/lesson/isExist', authLecturer, courseController.hasIndexLesson);

router.get('/:slug', courseController.show);
router.post('/:slug', courseController.postComment)
router.get('/', courseController.index);


module.exports = router;

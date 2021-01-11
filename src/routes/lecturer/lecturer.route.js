const express = require('express');
const router = express.Router();

const lecturerController = require('../../controllers/lecturer/LecturerController');

router.get('/profile', lecturerController.showProfile);
router.get('/courses/create', lecturerController.create);
router.post('/courses/store', lecturerController.store);
router.get('/courses/:slug', lecturerController.updateCourse);
router.post('/courses/lesson/add', lecturerController.addLesson);
router.get('/courses', lecturerController.index); /* /lecturer/courses: địa chỉ đầu tiên. */

module.exports = router;

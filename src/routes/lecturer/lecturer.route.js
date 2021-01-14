const express = require('express');
const router = express.Router();

const lecturerController = require('../../controllers/lecturer/LecturerController');
const courseController = require('../../controllers/course/CourseController');

// Phần logic
router.post('/courses/lesson/is-exist', courseController.hasIndexLesson);
//////////////////////////////////////
/* Phần CRUD liên quan tới bài giảng (lesson) của từng khóa học */
router.post('/courses/lesson/add', lecturerController.addLesson);
router.post('/courses/lesson/del/:id', lecturerController.deleteLesson);
router.post('/courses/lesson/edit/:id', lecturerController.editLesson);

/* Phần CRUD liên quan tới khóa học */
router.get('/courses/:slug/verify', lecturerController.verify)
router.get('/change-password', lecturerController.changePassword);
router.get('/profile', lecturerController.showProfile);
router.get('/courses/create', lecturerController.create);
router.post('/courses/store', lecturerController.store);
router.post('/courses/delete/:id', lecturerController.deleteCourse)
router.get('/courses/:slug', lecturerController.updateCourse);
/* Phần CRUD liên quan tới giảng viên */
router.get('/courses', lecturerController.index);

module.exports = router;

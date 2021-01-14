const express = require('express');
const router = express.Router();

const lecturerController = require('../../controllers/lecturer/LecturerController');

router.get('/profile', lecturerController.showProfile);
router.get('/courses/create', lecturerController.create);
router.post('/courses/store', lecturerController.store);
router.post('/courses/delete/:id', lecturerController.deleteCourse)
router.get('/courses/:slug', lecturerController.updateCourse);
router.get('/courses/:slug/verify', lecturerController.verify)
router.post('/courses/lesson/add', lecturerController.addLesson);
router.post('/courses/lesson/del/:id', lecturerController.deleteLesson);
router.post('/courses/lesson/edit/:id', lecturerController.editLesson);
router.post('/profile', lecturerController.updateProfile);

router.get('/changepassword', lecturerController.changepassword);
router.post('/changepassword', lecturerController.postChangePassword);
router.get('/courses', lecturerController.index); /* /lecturer/courses: địa chỉ đầu tiên. */

module.exports = router;

const express = require('express');
const router = express.Router();

const lecturerController = require('../../controllers/lecturer/LecturerController');

router.get('/profile', lecturerController.showProfile);
router.get('/courses/create', lecturerController.create);
// router.post('/courses/create', lecturerController.store);
router.post('/courses/store', lecturerController.store);
//router.post('/courses/uploadImage', lecturerController.uploadImage);
router.get('/courses', lecturerController.index); /* /lecturer/courses: địa chỉ đầu tiên. */

module.exports = router;

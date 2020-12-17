const express = require('express');
const router = express.Router();

const lecturerController = require('../../controllers/lecturer/LecturerController');
const manageCourseController = require('../../controllers/lecturer/manageCourseController');
const manageUpCourseController = require('../../controllers/lecturer/manageUpCourseController');



router.get('/', lecturerController.index);
router.get('/course', manageCourseController.index);
router.get('/course/upload', manageUpCourseController.index);



module.exports = router;
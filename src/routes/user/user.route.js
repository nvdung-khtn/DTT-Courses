const express = require('express');
const router = express.Router();

const userController = require('../../controllers/user/UserController');
const courseController = require('../../controllers/course/CourseController');

router.get('/manage/:id', userController.manage);
router.post('/manage', userController.postManage);
router.get('/changepassword/:id', userController.changepassword);
router.post('/changepassword', userController.postChangePassword);
router.get('/confirm', userController.confirm);
router.post('/confirm', userController.postconfirm);

router.get('/listbookmark/:id', userController.listcoursebookmark);
router.get('/mycourses/:id', userController.mycourse);

router.get('/courses/:id', courseController.videoCourse);
router.post('/courses/:slug', courseController.postComment);


router.get('/addbookmark/:id', userController.addCourseBookmark);

module.exports = router;

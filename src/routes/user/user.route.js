const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth.mdw');

const userController = require('../../controllers/user/UserController');

router.get('/manage/:id', userController.manage);
router.post('/manage', userController.postManage);
router.get('/changepassword/:id', userController.changepassword);
router.post('/changepassword', userController.postChangePassword);
router.get('/confirm', userController.confirm);
router.post('/confirm', userController.postconfirm);
router.get('/listbookmark/:id', userController.listcoursebookmark);
router.get('/mycourses/:id', userController.mycourse);

module.exports = router;

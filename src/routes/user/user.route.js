const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth.mdw');

const userController = require('../../controllers/user/UserController');

router.get('/manage/:id', auth.authUser, userController.manage);
router.post('/manage', auth.authUser,userController.postManage);
router.get('/changepassword/:id',auth.authUser, userController.changepassword);
router.post('/changepassword',auth.authUser, userController.postChangePassword);
router.get('/confirm',auth.authUser, userController.confirm);
router.post('/confirm',auth.authUser, userController.postconfirm);

module.exports = router;

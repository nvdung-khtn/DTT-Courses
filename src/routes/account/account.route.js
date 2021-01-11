const express = require('express');
const router = express.Router();

const accountController = require('../../controllers/account/AccountController');

router.get('/login', accountController.getLogin);
router.post('/login', accountController.postLogin);
router.post('/logout', accountController.postLogout);
router.get('/register', accountController.getRegister);
router.post('/register', accountController.postRegister);
router.get('/confirm', accountController.confirmRegister);
router.post('/confirm', accountController.postConfirmRegister);
router.post('/resetconfirm', accountController.postResetConfirmRegister);
router.get('/forgotpassword', accountController.forgotPassword);
router.post('/forgotpassword', accountController.postforgotPassword);
router.get('/resetpassword', accountController.resetPassword);
router.post('/resetpassword', accountController.postResetPassword);
router.get('/confirmforgotpassword', accountController.confirmForgotPassword);
router.post('/confirmforgotpassword', accountController.postConfirmForgotPassword);

module.exports = router;

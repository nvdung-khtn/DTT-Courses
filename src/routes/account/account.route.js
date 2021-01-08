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
router.get('/forgotpassword', accountController.forgotPassword);
router.get('/resetpassword', accountController.resetPassword);

module.exports = router;

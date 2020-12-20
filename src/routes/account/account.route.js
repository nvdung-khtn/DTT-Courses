const express = require('express');
const router = express.Router();

const accountController = require('../../controllers/account/AccountController');

router.get('/login', accountController.getLogin);
router.get('/register', accountController.getRegister);
router.get('/confirm', accountController.confirmRegister);

module.exports = router;
const express = require('express');
const router = express.Router();

const loginController = require('../../controllers/accountController/LoginController.js');

router.get('/', loginController.index);
//router.post('/', loginController.login);

module.exports = router;
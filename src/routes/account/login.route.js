const express = require('express');
const router = express.Router();

const loginController = require('../../controllers/account/LoginController');

router.get('/', loginController.index);
//router.post('/', loginController.login);

module.exports = router;
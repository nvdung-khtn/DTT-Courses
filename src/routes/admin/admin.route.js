const express = require('express');
const router = express.Router();

const adminController = require('../../controllers/admin/admin.controller');

router.get('/', adminController.index);
//router.post('/', loginController.login);

module.exports = router;
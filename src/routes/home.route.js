const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home/homeController');

router.get('/', homeController.index);

module.exports = router;

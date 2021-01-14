const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home/homeController');

router.get('/courses/:slug', homeController.index);
router.get('/courses', homeController.index);

router.get('/', homeController.index);


module.exports = router;
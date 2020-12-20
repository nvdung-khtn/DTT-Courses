const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home/homeController');

// Chỉ có duy nhất 1 route này, mọi route khác do couse.route đảm nhiệm.
router.get('/', homeController.index);

module.exports = router;
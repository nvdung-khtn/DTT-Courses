const express = require('express');
const router = express.Router();

const accountRouter = require('./account/account.route');
const homeController = require('../controllers/home/homeController');


/** Route of Account */
router.use('/account', accountRouter);

router.get('/', homeController.index);

module.exports = router;
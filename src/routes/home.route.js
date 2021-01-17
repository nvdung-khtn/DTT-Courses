const express = require('express');
const router = express.Router();
const { auth } = require('../middleWares/auth.mdw');

const homeController = require('../controllers/home/homeController');
const courseController = require('../controllers/course/CourseController');
const cartController = require('../controllers/cart/CartController');
/*Cart*/
router.get('/cart', auth, cartController.index);
router.get('/cart/remove/:id', auth, cartController.remove);
router.get('/cart/add/:id', auth, cartController.add);
router.post('/cart/checkout', auth, cartController.checkout);
/*Cart*/
router.get('/courses/:slug', courseController.show);
router.post('/course/count-view', courseController.countView);
router.get('/courses', courseController.index);
router.get('/', homeController.index);


module.exports = router;
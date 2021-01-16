const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home/homeController');
const courseController = require('../controllers/course/CourseController');
const cartController = require('../controllers/cart/CartController');
/*Cart*/
router.get('/cart', cartController.index);
router.get('/cart/remove/:id', cartController.remove);
router.get('/cart/add/:id', cartController.add);
router.post('/cart/checkout', cartController.checkout);
/*Cart*/
router.get('/courses/:slug', courseController.show);
router.get('/courses', courseController.index);
router.get('/', homeController.index);


module.exports = router;
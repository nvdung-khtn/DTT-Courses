const express = require('express');
const router = express.Router();

const cartController = require('../../controllers/cart/CartController');

router.get('/', cartController.index);
router.get('/remove/:id', cartController.remove);
router.get('/add/:id', cartController.add);
router.post('/checkout', cartController.checkout);

module.exports = router;
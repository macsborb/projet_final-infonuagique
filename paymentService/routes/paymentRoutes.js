const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/cart', paymentController.addItemToCart);
router.get('/cart', paymentController.getCart);
router.post('/checkout', paymentController.checkout);

module.exports = router;

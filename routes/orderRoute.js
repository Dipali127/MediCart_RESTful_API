const express = require('express');
const router = express.Router();
const authentication = require('../middleware/auth.js');
const orderController = require('../controllers/orderController.js');

router.post('/placeOrder/:buyerId', authentication.auth,authentication.permission('buyer'),orderController.placeOrder);
router.patch('/cancelOrder/:buyerId', authentication.auth, authentication.permission('buyer'),orderController.cancelOrder)
module.exports = router;
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/capture',  paymentController.payMent);
router.post('/webhook', paymentController.handleWebhook);
module.exports = router;
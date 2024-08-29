const express = require('express');
const router = express.Router();
const authentication = require('../middleware/auth.js');
const orderController = require('../controllers/orderController.js');

router.post('/placeOrder', orderController.placeOrder);
router.patch('/cancelOrder/:buyerId', authentication.auth, authentication.permission('buyer'),orderController.cancelOrder)

// route to handle endpoint 
router.all("/*",(req,res)=>{res.status(404).send({status:false,message:"Endpoint is not correct"})})

module.exports = router;
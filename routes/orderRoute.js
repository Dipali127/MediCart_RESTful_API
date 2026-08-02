const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const orderController = require('../controllers/orderController.js');

router.post('/placeOrder', auth.authentication, auth.permission('buyer'), orderController.placeOrder);
router.patch('/cancelOrder/:buyerId', auth.authentication, auth.permission('buyer'),orderController.cancelOrder)

//route to handle endpoint 
router.all("/*",(req,res)=>{res.status(404).send({status:false,message:"Endpoint is not correct"})})

module.exports = router;
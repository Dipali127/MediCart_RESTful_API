const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const cartController = require('../controllers/cartController');

router.post('/addCart/:buyerId', auth.authentication, auth.permission('buyer'),cartController.addMedicineTocart);
router.get('/viewCart/:buyerId', auth.authentication, auth.permission('buyer'),cartController.viewCart);
router.patch('/updateCartQuantity/:buyerId', auth.authentication, auth.permission('buyer'),cartController.updateCartQuantity)
router.delete('/deleteMedicine/:buyerId', auth.authentication, auth.permission('buyer'),cartController.deleteMedicinefromCart);

//route to handle endpoint 
router.all("/*",(req,res)=>{res.status(404).send({status:false,message:"Endpoint is not correct"})})
module.exports = router;


const express = require('express');
const router = express.Router();
const authentication = require('../middleware/auth');
const cartController = require('../controllers/cartController');

router.post('/addCart/:buyerId', authentication.auth, authentication.permission('buyer'),cartController.addMedicineTocart);
router.get('/viewCart/:buyerId',authentication.auth,authentication.permission('buyer'),cartController.viewCart);
router.delete('/deleteMedicine/:buyerId',authentication.auth,authentication.permission('buyer'),cartController.deleteMedicinefromCart);

//route to handle endpoint 
router.all("/*",(req,res)=>{res.status(404).send({status:false,message:"Endpoint is not correct"})})
module.exports = router;
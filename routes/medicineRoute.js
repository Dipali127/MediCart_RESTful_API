const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const authentication = require('../middleware/auth.js');
const fileUpload = require('../middleware/multerMiddleware.js');

router.post('/add', authentication.auth, authentication.permission('seller'),fileUpload,medicineController.addMedicine);
router.get('/getMedicine',authentication.auth,medicineController.getMedicine);
router.patch('/update/:medicineId',authentication.auth,authentication.permission('seller'),fileUpload,medicineController.updateMedicine);
router.patch('/delete/:medicineId',authentication.auth,authentication.permission('seller'),medicineController.deleteMedicine);

// route to handle endpoint 
router.all("/*",(req,res)=>{res.status(404).send({status:false,message:"Endpoint is not correct"})})

module.exports = router;

// seller email and password:-
// "email": "reena32@gmail.com",
//     "password": "reen@A11a"

// buyer email and password:-
//   "email": "manish22@gmail.com",
//     "password": "man@S11a"
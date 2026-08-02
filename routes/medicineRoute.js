const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const fileUpload = require('../middleware/multerMiddleware.js');
const auth = require('../middleware/auth')

router.post('/add', auth.authentication, auth.permission('seller'),fileUpload,medicineController.addMedicine);
router.get('/getMedicine', auth.authentication, medicineController.getMedicine);
router.patch('/update/:medicineId', auth.authentication, auth.permission('seller'),fileUpload,medicineController.updateMedicine);
router.patch('/delete/:medicineId', auth.authentication, auth.permission('seller'),medicineController.deleteMedicine);

//route to handle endpoint 
router.all("/*",(req,res)=>{res.status(404).send({status:false,message:"Endpoint is not correct"})})

module.exports = router;


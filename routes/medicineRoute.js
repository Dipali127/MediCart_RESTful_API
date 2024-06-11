const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const authentication = require('../middleware/auth.js');
const fileUpload = require('../middleware/multerMiddleware.js');

router.post('/add', authentication.auth, authentication.permission('seller'),fileUpload,medicineController.addMedicine);
router.get('/getMedicine',authentication.auth,medicineController.getMedicine);
router.patch('/update/:medicineId',authentication.auth,authentication.permission('seller'),fileUpload,medicineController.updateMedicine);
router.patch('/delete/:medicineId',authentication.auth,authentication.permission('seller'),medicineController.deleteMedicine);

module.exports = router;
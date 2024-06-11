const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authentication = require('../middleware/auth')

router.post('/signUp', userController.signUp);
router.post('/signIn', userController.signIn);
router.post('/address',authentication.auth,authentication.permission('buyer'),userController.addressofUser);

module.exports = router;
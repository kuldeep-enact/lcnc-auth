const express = require('express');
const router = express.Router();
const AuthController = require('../controller/authController'); 
const { checkLoggedIn } = require('../utills/helper');
const upload = require('../utills/uploadImage');
const {verifyToken} = require('../utills/helper');

const { registerValidationRules, validate,loginValidationRules,forgotPasswordValidationRules,changePasswordRules } = require('../validator/validationRule');


router.post('/register', registerValidationRules(),validate,AuthController.register);
//router.post('/register',AuthController.register);
   
router.post('/login',loginValidationRules(),validate,AuthController.login);

router.post('/upload',upload.single('image'),AuthController.upload);

router.post('/test',AuthController.test);

router.post('/forgot-password',forgotPasswordValidationRules(),validate, AuthController.forgotPassword);

router.get('/update-password/:tokenLink',AuthController.updatePassword);
router.post('/set-password',AuthController.setPassword);
router.post('/change-password',changePasswordRules(),validate,checkLoggedIn, AuthController.changePassword);

router.put('/profile',verifyToken,upload.single('image'),AuthController.profile);

router.get('/profile',verifyToken,AuthController.getProfile);
//router.post('/uploadImage',upload.single('image'), AuthController.uploadImage);
module.exports = router;
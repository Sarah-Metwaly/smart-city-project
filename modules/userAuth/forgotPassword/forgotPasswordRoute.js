const express = require('express');
const router = express.Router();

const forgotPasswordController = require('./forgotPasswordController');
const validate = require('../../../shared/middlewares/validate');
const {forgotPasswordSchema} = require('./forgotPasswordValidation');

router.post('/forgotPassword' , validate.validate(forgotPasswordSchema) ,forgotPasswordController.forgotPassword );

module.exports=router;
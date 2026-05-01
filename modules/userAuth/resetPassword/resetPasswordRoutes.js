const express = require('express');
const router = express.Router();

const resetpasswordController = require('./resetPasswordController');
const validate = require('../../../shared/middlewares/validate');
const {resetPasswordSchema} = require('./resetPasswordValidation');

router.post('/resetPassword' , validate.validate(resetPasswordSchema) , resetpasswordController.resetPassword);

module.exports= router;
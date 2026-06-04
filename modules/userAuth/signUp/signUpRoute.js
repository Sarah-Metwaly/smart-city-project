const express = require('express');
const signUpController = require('./signUpController');
const router = express.Router();
const signUpSchema = require('./signUpValidation');
const {validate} = require('../../../shared/middlewares/validate');

router.post('/signup', validate(signUpSchema.signUpSchema), signUpController.signUpUser);

module.exports = router;
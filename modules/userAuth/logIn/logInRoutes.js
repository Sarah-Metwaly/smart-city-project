const logInController = require('./logInController');
const validate = require('../../../shared/middlewares/validate');
const logInValidation= require('./logInValidation');
const express = require('express');
const router = express.Router();

router.post('/login', validate.validate(logInValidation.loginSchema), logInController.LogInUser);

module.exports = router;
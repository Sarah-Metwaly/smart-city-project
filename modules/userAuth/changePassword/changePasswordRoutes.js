const express = require('express');
const router = express.Router();

const { changePasswordController } = require('./changePasswordController');
const { changePasswordSchema } = require('./changePasswordValidation');
const {authenticate} = require('../middleware/authenticate');
const {validate} = require('../../../shared/middlewares/validate');

router.patch('/change-password', authenticate, validate(changePasswordSchema), changePasswordController);

module.exports = router;

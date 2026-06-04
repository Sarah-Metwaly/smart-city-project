const express = require('express');
const router = express.Router();

const {activateUserController} = require('./activateUserController');
const {authenticate} = require('../middleware/authenticate');
const {isAdmin} = require('../middleware/authorize');

router.patch('/activate/:id', authenticate, isAdmin, activateUserController);

module.exports = router;
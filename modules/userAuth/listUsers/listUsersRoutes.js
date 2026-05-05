const express = require('express');
const router = express.Router();

const listUsersController = require('./listUsersController').listUsersController;
const authenticate = require('../middleware/authenticate').authenticate;
const authorize = require('../middleware/authorize').isAdmin;

router.get('/listUsers' , authenticate , authorize , listUsersController);

module.exports = router;


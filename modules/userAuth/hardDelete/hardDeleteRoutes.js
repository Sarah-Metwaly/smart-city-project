const express = require('express');
const router = express.Router();

const { hardDeleteController } = require('./hardDeleteController');
const {authenticate} = require('../middleware/authenticate');
const {isAdmin} = require('../middleware/authorize');

router.delete('/delete/:id', authenticate, isAdmin, hardDeleteController);

module.exports = router;
const express = require('express');
const router = express.Router();

const { deactivateUserController } = require('./deactivateUserController');
const { authenticate } = require('../middleware/authenticate');
const { isAdmin } = require('../middleware/authorize');

router.route('/deactivate/:id')
    .patch(authenticate, isAdmin, deactivateUserController);   
    
module.exports = router;
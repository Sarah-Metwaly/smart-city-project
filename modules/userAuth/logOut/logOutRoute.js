const express=require('express');
const router = express.Router();
const logOutController = require('./logOutController');
const authenticate= require('../middleware/authenticate');

router.post('/logOut' , authenticate.authenticate , logOutController.logOutUser);

module.exports= router;

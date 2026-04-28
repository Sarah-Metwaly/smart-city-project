const express=require('express');
const router = express.Router();
const refreshTokenController = require('./refreshTokenController');

router.post('/refreshToken' , refreshTokenController.refreshAccessToken)

module.exports= router;

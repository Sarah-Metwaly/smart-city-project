const express = require('express');
const router = express.Router();

const createOfficerController = require('./createOfficerController');
const validate  =require('../../../shared/middlewares/validate');
const { createOfficerSchema } = require('./createOfficerValidation');
const upload = require('../utils/multerConfig');
const authorize = require('../middleware/authorize').isAdmin;
const authenticate = require('../middleware/authenticate');

router.post('/createOfficer' , authenticate.authenticate, authorize, upload.single('officerPhoto'), validate.validate(createOfficerSchema) , createOfficerController.createOfficer);

module.exports = router;
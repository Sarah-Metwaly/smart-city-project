const catchAsync = require('../../../shared/utils/catchAsync');
const createOfficerService = require('./createOfficerService');

exports.createOfficer = catchAsync(async (req, res)=>{
    const { email, password, firstName, lastName, department } = req.body;
  
    // Photo path from multer
    const photoPath = req.file ? `/uploads/officers/${req.file.filename}` : null;

    const officer = await createOfficerService.createOfficer(
        { email, password, firstName, lastName, department },
        photoPath
    );

    res.status(201).json({
        status: 'success',
        message: 'Officer created successfully',
        data: { officer },
    });
})
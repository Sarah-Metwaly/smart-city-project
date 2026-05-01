const catchAsync = require('../../../shared/utils/catchAsync');
const forgotPasswordService= require('./forgotPasswordService');

exports.forgotPassword = catchAsync(async(req,res) =>{
    const {email} = req.body;

    await forgotPasswordService.forgotPassword(email);

    res.status(200).json({
        status:'success',
        message: 'Password reset email sent successfully'
    })
})
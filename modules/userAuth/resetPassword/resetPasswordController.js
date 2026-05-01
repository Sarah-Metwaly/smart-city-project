const catchAsync = require('../../../shared/utils/catchAsync');
const resetPasswordService = require('./resetPasswordService');

exports.resetPassword =catchAsync( async (req, res) =>{
    const {token , password } = req.body;
    await resetPasswordService.resetPassword(token , password);

    res.status(200).json({
        status: 'success',
        message: 'Password reset successfully. Please login with your new password.',
    })
});
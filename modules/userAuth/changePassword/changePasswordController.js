const catchAsync = require('../../../shared/utils/catchAsync');
const { changePasswordService } = require('./changePasswordService');

const changePasswordController = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    await changePasswordService(userId, currentPassword, newPassword);

    res.status(200).json({
        status: 'success',
        message: 'Password changed successfully'
    });
});

module.exports = { changePasswordController };
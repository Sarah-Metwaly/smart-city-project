const User = require('../userModel');
const AppError = require('../../../shared/utils/AppError');

const changePasswordService = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    // Check if the current password is correct
    const isCorrect = await user.comparePassword(currentPassword);
    if (!isCorrect) {
        throw new AppError('Current password is incorrect', 401);
    }
    // Update the password
    user.password = newPassword;
    //clear all refresh tokens to log out from all devices - to be more secure and avoid any unauthorized access with the old password
    user.refreshToken = [];
    await user.save();

    return true;
};

module.exports = { changePasswordService };
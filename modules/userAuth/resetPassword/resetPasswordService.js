const User= require('../userModel');
const AppError = require('../../../shared/utils/AppError');
const token = require('../utils/token');

exports.resetPassword = async (rawToken , newPassword) =>{
    //Hash incoming token
    const hashedToken = token.hashToken(rawToken);

    //Find user with valid token
    const user = await User.findOne({
        passwordResetToken : hashedToken,
        passwordResetExpires : {$gt : Date.now()}
    });

    if(!user) {
        throw new AppError ('Invalid or expired reset token', 400)
    }

    //Update Password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    //clear all refresh token (force re-logins everyWhere)
    user.refreshToken = [];

    await user.save();
    return true;
};
const User = require('../userModel');
const AppError = require('../../../shared/utils/AppError');
const token = require('../utils/token');
const {sendPasswordResetEmail} = require('../utils/email');

exports.forgotPassword = async (email) =>{
    //Find user
    const user = await User.findOne({email});

    if(!user){
        throw new AppError('Email not found' , 404);
    }

    //Generate reset token
    const {rawToken , hashedToken, expiresAt} =token.generatePasswordResetToken();

    //Save to DB
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = expiresAt;
    await user.save({validateBeforeSave:false});

    //sendEmail
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`
    sendPasswordResetEmail(email , resetUrl).catch((err)=>{
        console.error('Failed to send reset email:', err);
    });
    return true;
}

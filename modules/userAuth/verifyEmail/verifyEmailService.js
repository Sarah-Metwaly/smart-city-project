const User = require('../userModel');
const AppError = require('../../../shared/utils/AppError');
const { email } = require('zod');
const { is } = require('zod/locales');
const hashToken = require('../utils/token').hashToken;

exports.verifyEmail = async (rawToken) => {
    const hashedToken = hashToken(rawToken);

    const user = await User.findOne({ emailVerficationToken: hashedToken, emailVerificationExpires: { $gt: Date.now() } });

    if (!user) {
        throw new AppError('Invalid or expired verification token', 400);
    }

    if(user.isEmailVerified) {
        throw new AppError('Email is already verified', 400);
    }

    user.isEmailVerified = true;
    user.emailVerficationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        fullName: user.fullName,
        isEmailVerified: user.isEmailVerified
    };
};

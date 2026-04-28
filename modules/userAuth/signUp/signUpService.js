const User = require('../userModel');
const token = require('../utils/token');
const { sendVerificationEmail } = require('../utils/email');
const AppError = require('../../../shared/utils/AppError');

exports.signUpUser = async ({email , password , firstName , lastName}) => {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if(existingUser) {
        throw new AppError('Email is already registered', 409);
    }

    //generate email verification token
    const {rawToken , hashedToken , expiresAt} = token.generateEmailVerificationToken();


    // Create the user
    const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        role:'citizen',
        isEmailVerfied: false,
        emailVerficationToken: hashedToken,
        emailVerificationExpires: expiresAt
    })

    // Send verification email
    const verficationUrl=`${process.env.FRONTEND_URL}/verify-email?token=${rawToken}`;
    await sendVerificationEmail(user.email , verficationUrl).catch(err => {
        console.error('Error sending verification email:', err);
    });

    return {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        fullName: user.fullName,
        isEmailVerfied: user.isEmailVerfied,
    }

}


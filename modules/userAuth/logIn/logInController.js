const logInService = require('./logInService');
const catchAsync = require('../../../shared/utils/catchAsync');

exports.LogInUser = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const result = await logInService.logInUser({ email, password });

    //cookies options
    const refreshTokenCookieOptions = {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only sent over HTTPS in production
        sameSite: 'Strict', // Helps prevent CSRF attacks by not sending the cookie with cross-site requests
        maxAge: 7 * 24 * 60 * 60 * 1000, // Sets the cookie to expire in 7 days
    }

    res.cookie('refreshToken', result.refreshToken, refreshTokenCookieOptions);

    res.status(200).json({
        status: 'success',
        message: 'Logged in successfully',
        data: {
            accessToken: result.accessToken,
            user: result.user,
        },
    });
});

const catchAsync = require('../../../shared/utils/catchAsync');
const AppError=require('../../../shared/utils/AppError');
const refreshTokenService= require('./refreshTokenService');

exports.refreshAccessToken = catchAsync(async (req,res) =>{
    //Get refresh token from cookie
    const incomingRefreshToken=req.cookies?.refreshToken;

    if(!incomingRefreshToken){
        throw new AppError('Refresh token not found. Please login.', 401);
    }

    const {accessToken , refreshToken} =  await refreshTokenService.refreshAccessToken(incomingRefreshToken);

    const refreshTokenCookieOptions ={
        httpOnly: true,
        secure: process.env.NODE_ENV==='production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }

    res.cookie('refreshToken' , refreshToken , refreshTokenCookieOptions)

    //return new access token
    res.status(200).json({
        status: 'success',
        message: 'Token refreshed successfully',
        data: {
            accessToken,
        },
    })
})
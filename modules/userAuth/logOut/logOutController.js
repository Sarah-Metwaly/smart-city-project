const catchAsync = require('../../../shared/utils/catchAsync');
const logOutService = require('./logOutService');
const AppError = require('../../../shared/utils/AppError');

exports.logOutUser = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
    throw new AppError('Refresh token not found', 401);
  }

  await logOutService.logOutUser(req.user._id, refreshToken);

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

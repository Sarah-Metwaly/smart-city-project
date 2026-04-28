const User = require('../userModel');
const AppError = require('../../../shared/utils/AppError');
const token = require('../utils/token');

exports.refreshAccessToken = async (incomingRefreshToken) => {
  //step 1 : verify refresh token
  let decoded;
  try {
    decoded = token.verifyRefreshToken(incomingRefreshToken);
  } catch (err) {
    throw new AppError('Invalid refresh token. Please login again.', 401);
  }

  //step 2 : Find User
  const user = await User.findById(decoded.userId);

  if (!user || !user.isActive) {
    throw new AppError('User not found or deactivated.', 401);
  }

  //step 3: check token exists in the DB
  // Trim the incoming token to remove any whitespace
  const cleanIncomingToken = incomingRefreshToken.trim();

  const tokenExists = user.refreshToken.some(
    (rt) => rt.token === cleanIncomingToken,
  );

  if (!tokenExists) {
    // SECURITY: Token reuse detected!
    // Someone stole an old refresh token and tried to use it
    // Clear ALL refresh tokens, force user to login again
    user.refreshToken = [];
    await user.save({ validateBeforeSave: false });

    throw new AppError('Invalid refresh token. Please login again.', 401);
  }

  //step 4 : Generate new tokens
  const newAccessToken = token.generateAccessToken(user._id);
  const newRefreshToken = token.generateRefreshToken(user._id);

  //step 5 :Rotate - remove old token
  user.refreshToken = user.refreshToken.filter(
    (rt) => rt.token !== incomingRefreshToken,
  );

  user.refreshToken.push({
    token: newRefreshToken,
    createdAt: new Date(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  if (user.refreshToken.length > 5) {
    user.refreshToken = user.refreshToken.slice(-5);
  }

  await user.save({ validateBeforeSave: false });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

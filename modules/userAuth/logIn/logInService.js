const User = require('../userModel');
const AppError = require('../../../shared/utils/AppError');
const token = require('../utils/token');

exports.logInUser = async ({ email, password }) => {
  // Find the user by email and include the password field for verification
  const user = await User.findOne({ email }).select('+password');

  // If the user is not found, throw an error
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account has been deactivated', 403);
  }

  if (!user.isEmailVerified) {
    throw new AppError(
      'Email not verified. Please verify your email before logging in.',
      403,
    );
  }

  // Verify the provided password against the stored hashed password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate JWT access and refresh tokens for the authenticated user
  const accessToken = token.generateAccessToken(user._id);
  const refreshToken = token.generateRefreshToken(user._id);

  // Store the refresh token in the database for future validation and management
  user.refreshToken.push({
    token: refreshToken,
    createdAt: new Date(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expiration time for the refresh token (7 days)
  });

  //Keep only the latest 5 refresh tokens for security and performance reasons
  if (user.refreshToken.length > 5) {
    user.refreshToken = user.refreshToken.slice(-5);
  }

  user.lastLogin = Date.now(); // Update the last login timestamp for the user
  await user.save({ validateBeforeSave: false }); // Save the updated user information to the database

  // Return the generated tokens and user information (excluding the password)
  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      fullName: user.fullName,
    },
  };
};

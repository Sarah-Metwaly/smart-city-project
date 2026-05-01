const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.hashToken = (token) => {
    // Hash the token using SHA-256 for secure storage
    return crypto.createHash('sha256').update(token).digest('hex');
};

exports.generateEmailVerificationToken = () => { 
    // Generate a random token, hash it, and set an expiration time for email verification
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = exports.hashToken(token);
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    return {rawToken: token, hashedToken, expiresAt };
};

exports.generatePasswordResetToken = () =>{
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = exports.hashToken(token);
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

    return { rawToken: token, hashedToken, expiresAt };
}

// Function to generate a JWT access token for a user
exports.generateAccessToken = (userId) =>{
    // Generate a JWT access token with the user's ID as the payload
    return jwt.sign(
        { userId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' } // Access token expires in 15 minutes
    )
};

// Function to generate a JWT refresh token for a user - For long-term authentication -7 days for example
exports.generateRefreshToken = (userId) =>{
    // Generate a JWT refresh token with the user's ID as the payload
    return jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' } // Refresh token expires in 7 days
    )
};

exports.verifyRefreshToken = (token) =>{
    return jwt.verify(token , process.env.JWT_REFRESH_SECRET)
}
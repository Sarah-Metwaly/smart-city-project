const jwt = require('jsonwebtoken');
const User = require('../userModel');
const AppError = require('../../../shared/utils/AppError');
const catchAsync = require('../../../shared/utils/catchAsync');

const authenticate = catchAsync(async (req, res, next) => {
    //step 1 :Get token from header or cookie
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }


    if(!token) {
        return next(new AppError('Access denied. No token provided.', 401));
    }

    //step 2:verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    //step 3:check if user still exists
    const user= await User.findById(decoded.userId);
    if(!user) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    //step 4 : check user is active
    if(!user.isActive) {
        return next(new AppError('Your account is deactivated. Please contact support.', 403));
    }

    //step 5 : Attach user to request
    req.user = user;
    next();
    
})

module.exports = { authenticate };
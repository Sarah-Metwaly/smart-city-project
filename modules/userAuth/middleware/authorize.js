const AppError = require('../../../shared/utils/AppError');

exports.authorize = (...roles) =>{
    return (req, res, next) => {
        if(!req.user) {
            return next(new AppError('User not authenticated.', 401));
        }

        if(!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action.', 403));
        }

        next();
    }
}

exports.isAdmin = exports.authorize('admin');
exports.isOfficer = exports.authorize('officer' , 'admin');
exports.isCitizen = exports.authorize('citizen' , 'officer' , 'admin');

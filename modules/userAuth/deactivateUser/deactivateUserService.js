const User = require('../userModel');
const AppError = require('../../../shared/utils/AppError');

const deactivateUser = async (userId) => {
    const user = await User.findByIdAndUpdate(userId, { isActive: false }, { new: true , runValidators: false }).select('-password -refreshToken');

    if(!user){
        throw new AppError('User not found' , 404);
    }

    //clear all refresh tokens for the user , so the user will be logged out from all devices
    user.refreshToken = [];
    await user.save({ validateBeforeSave: false });
    return user;
}

module.exports = {deactivateUser};
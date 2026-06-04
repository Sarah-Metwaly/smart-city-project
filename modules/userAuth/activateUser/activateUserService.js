const User = require('../userModel');
const AppError = require('../../../shared/utils/AppError');

const activateUserService = async (userId) => {
    const user = await User.findByIdAndUpdate(userId, { isActive: true }, { new: true , runValidators: false }).select('-password -refreshToken');

    if(!user) {
        throw new AppError('User not found', 404);
    }
    return user;
};

module.exports = {
    activateUserService
};
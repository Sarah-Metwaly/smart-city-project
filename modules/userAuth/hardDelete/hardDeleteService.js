const User = require('../userModel');
const AppError = require('../../../shared/utils/AppError');

const hardDeleteService = async (userId) => {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }   

    return true;
}

module.exports = {
    hardDeleteService
};
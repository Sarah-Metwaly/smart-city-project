const User=require('../userModel');

exports.logOutUser = async(userId,currentRefreshToken) =>{
    //Remove the current refresh token from DB
    await User.findByIdAndUpdate(userId , {
        $pull: {refreshToken: {token : currentRefreshToken}}
    });
    return true;
}


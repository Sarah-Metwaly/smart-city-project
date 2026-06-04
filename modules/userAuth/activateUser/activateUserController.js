const catchAsync = require("../../../shared/utils/catchAsync");
const { activateUserService } = require("./activateUserService");  

const activateUserController = catchAsync(async (req, res) => {
    const {id} = req.params;
    const user = await activateUserService(id);
    res.status(200).json({  
        status: 'success',
        message: 'User activated successfully',
        data: {
            user
        }
    });
});

module.exports = {
    activateUserController
};

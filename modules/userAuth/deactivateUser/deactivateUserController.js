const catchAsync = require("../../../shared/utils/catchAsync");
const { deactivateUser } = require("./deactivateUserService");

const deactivateUserController = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const user = await deactivateUser(userId);
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

module.exports = {deactivateUserController};    
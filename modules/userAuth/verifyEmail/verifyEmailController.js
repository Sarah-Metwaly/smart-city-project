const catchAsync = require("../../../shared/utils/catchAsync");
const verifyEmailService = require("./verifyEmailService");

exports.verifyEmail = catchAsync(async (req, res) => {
    const { token } = req.body;

    const userData = await verifyEmailService.verifyEmail(token);

    res.status(200).json({
        status: 'success',
        data: {
            user: userData
        }
    });
});
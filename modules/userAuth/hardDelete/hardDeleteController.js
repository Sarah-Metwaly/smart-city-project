const catchAsync = require('../../../shared/utils/catchAsync');
const {hardDeleteService} = require('./hardDeleteService');

const hardDeleteController = catchAsync(async (req, res, next) => {
    const userId = req.params.id;
    await hardDeleteService(userId);

    res.status(204).send()
});

module.exports = {
    hardDeleteController
};

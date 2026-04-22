const aiDataService = require('./aiDataService');
const catchAsync = require('../../shared/utils/catchAsync');

exports.createAiData = catchAsync(async (req, res) => {
    const aiDataEntry = await aiDataService.saveAiData(req.body);
    res.status(201).json({
        status: 'success',
        data: aiDataEntry
    });
});

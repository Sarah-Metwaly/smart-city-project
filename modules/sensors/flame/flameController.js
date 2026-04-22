const flameService = require('./flameService');
const catchAsync = require('../../../shared/utils/catchAsync');

//Only for testing purposes, to be removed in production
exports.saveReading = catchAsync(async (req, res) => {
    const data = req.body;
    const savedReading = await flameService.saveReading(data);
    res.status(201).json({
        status: 'success',
        data: savedReading,
    });
});

exports.getLatestReadings = catchAsync(async (req, res) => {
    const latestReadings = await flameService.getLatestReadings();
    res.status(200).json({
        status: 'success',
        data: latestReadings
    });
});
const bmp180Service = require('./bmp180Service');
const catchAsync = require('../../../shared/utils/catchAsync');

exports.saveReading = catchAsync(async (req, res) => {
    const data = req.body;
    const savedReading = await bmp180Service.saveReading(data);
    res.status(201).json({
        status: 'success',
        data: savedReading
    });
});

exports.getLatestReadings = catchAsync(async (req, res) => {
    const latestReadings = await bmp180Service.getLatestReadings();
    res.status(200).json({
        status: 'success',
        data: latestReadings
    });
});
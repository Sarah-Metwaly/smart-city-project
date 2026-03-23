const dht11Service = require('../services/dht11Service');
const catchAsync = require('../utils/catchAsync');

exports.saveReading = catchAsync(async (req, res) => {
    const data = req.body;
    const savedReading = await dht11Service.saveReading(data);
    res.status(201).json({
        status: 'success',
        data: savedReading
    });
});

exports.getLatestReadings = catchAsync(async (req, res) => {
    const latestReadings = await dht11Service.getLatestReadings();
    res.status(200).json({
        status: 'success',
        data: latestReadings
    });
});
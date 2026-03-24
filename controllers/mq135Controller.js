const mq135Service = require('../services/mq135Service');
const catchAsync = require('../utils/catchAsync');

exports.saveReading = catchAsync(async (req, res) => {
    const data = req.body;
    const savedReading = await mq135Service.saveReading(data);
    res.status(201).json({
        status: 'success',
        data: savedReading
    });
});

exports.getLatestReadings = catchAsync(async (req, res) => {
    const latestReadings = await mq135Service.getLatestReadings();
    res.status(200).json({
        status: 'success',
        data: latestReadings
    });
});
    
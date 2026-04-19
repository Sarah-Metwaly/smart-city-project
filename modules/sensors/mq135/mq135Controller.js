const mq135Service = require('./mq135Service');
const catchAsync = require('../../../shared/utils/catchAsync');

exports.saveReading = catchAsync(async (req, res) => {
    const data = req.body;
    const savedReading = await mq135Service.saveReading(data);
    res.status(201).json({
        status: 'success',
        data: savedReading,
        incident: incident || null
    });
});

exports.getLatestReadings = catchAsync(async (req, res) => {
    const latestReadings = await mq135Service.getLatestReadings();
    res.status(200).json({
        status: 'success',
        data: latestReadings
    });
});
    
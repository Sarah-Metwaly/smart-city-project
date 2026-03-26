const dailySummaryService = require('../services/dailySummaryService');
const catchAsync = require('../utils/catchAsync');

exports.getWeeklyConsumption = catchAsync(async (req, res) => {
    const data = await dailySummaryService.getWeeklyConsumption();
    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.getTodaySummary = catchAsync(async (req, res) => {
    const data = await dailySummaryService.getTodaySummary();
    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.getDailyComparison = catchAsync(async (req, res) => {
    const data = await dailySummaryService.getDailyComparison();
    res.status(200).json({
        status: 'success',
        data: data
    });
});
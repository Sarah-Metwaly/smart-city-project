const dangerZoneService = require('./dangerZoneService');
const catchAsync = require('../../shared/utils/catchAsync');

exports.getWeeklyDangerZones = catchAsync(async (req, res) => {
    const dangerZones = await dangerZoneService.getWeeklyDangerZones();
    res.status(200).json({
        status: 'success',
        data: dangerZones
    });
});
const dangerZoneService = require('./dangerZoneService');
const catchAsync = require('../../shared/utils/catchAsync');

exports.getWeeklyDangerZones = catchAsync(async (req, res) => {
    const { type } = req.query; // e.g. ?type=fire to focus on fire incidents
    const dangerZones = await dangerZoneService.getWeeklyDangerZones(type);
    res.status(200).json({
        status: 'success',
        data: dangerZones
    });
});
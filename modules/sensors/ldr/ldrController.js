const ldrService = require('./ldrService');
const catchAsync = require('../../../shared/utils/catchAsync');

exports.saveReading = catchAsync(async (req , res) => {
    const reading = await ldrService.saveReading(req.body);
    res.status(201).json({
        status: 'success',
        data: reading
    })
} );

exports.getSensorStatus = catchAsync(async (req , res) => {
    const TotalNumber= await ldrService.getSensorStatus();
    res.status(200).json({
        status: 'success',        
        data: TotalNumber
    })
});    

exports.getTotalActiveLoad = catchAsync(async (req , res) => {
    const total = await ldrService.getTotalActiveLoad();
    res.status(200).json({
        status: 'success',
        data: total
    });
});
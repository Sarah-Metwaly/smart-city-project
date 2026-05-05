const catchAsync = require('../../../shared/utils/catchAsync');
const { listUsers } = require('./listUsersService');

exports.listUsersController = catchAsync(async (req, res) => {    
    const filters = {
        role: req.query.role,
        department: req.query.department,
        isActive: req.query.isActive,
        search: req.query.search,
        page: req.query.page,
        limit: req.query.limit,
        sort: req.query.sort
    };

    const result = await listUsers(filters);

    res.status(200).json({
        success: true,
        results: result.users.length,
        data: result,
    });
});



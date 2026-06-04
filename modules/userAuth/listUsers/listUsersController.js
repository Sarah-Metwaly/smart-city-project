const catchAsync = require('../../../shared/utils/catchAsync');
const { listUsers , getUserById } = require('./listUsersService');

exports.listUsersController = catchAsync(async (req, res) => {    
    //If id query exists, get user by id, else get all users with filters
    if(req.query.id){
        const user = await getUserById(req.query.id);

    return res.status(200).json({
      status: 'success',
      data: { user },
    });
    }
    //else get all users with filters
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



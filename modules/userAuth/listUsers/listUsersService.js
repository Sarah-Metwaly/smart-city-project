const { parse } = require('dotenv');
const User = require('../userModel');

// Helper function to build the MongoDB query based on provided filters
const buildQuery = (filters) =>{
    let query = {};

    if(filters.role) query.role = filters.role;
    if (filters.department) query.department = filters.department;
    if (filters.isActive !== undefined) query.isActive = filters.isActive === 'true';

    if(filters.search) {
        query.$or = [ // Case-insensitive regex search for firstName, lastName, and email - regex allows for partial matches
            { firstName: { $regex: filters.search, $options: 'i' } },
            { lastName: { $regex: filters.search, $options: 'i' } },
            { email: { $regex: filters.search, $options: 'i' } },
        ];
    };

    return query;
};

const getUserById = async (userId) =>{
    const user = await User.findById(userId).select('-password -refreshTokens -emailVerificationToken -passwordResetToken');
    if(!user){
        throw new AppError('User not found');
    }
    return user;
}

// Main function to list users based on filters, pagination, and sorting
const listUsers = async (filters) => {
    const page = parseInt(filters.page , 10) || 1;
    const limit = parseInt(filters.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const sort = filters.sort || '-createdAt';
    const query = buildQuery(filters);

    const [users , total ] = await Promise.all([
        User.find(query)
            .select('-password -refreshTokens -emailVerificationToken -passwordResetToken')
            .sort(sort)
            .skip(skip)
            .limit(limit),
        User.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        users,
        pagination:{
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage : page > 1
        }
    }
}

module.exports = {listUsers , getUserById};
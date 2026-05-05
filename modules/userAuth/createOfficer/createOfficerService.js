const User=require('../userModel');
const AppError = require('../../../shared/utils/AppError');
const generateBadgeNumber = require('../utils/generateBadgeNumber');

exports.createOfficer = async({email,password , firstName , lastName , department} , photoPath) =>{
    // Check if email already exists
    const existingUser = await User.findOne({email})
    if(existingUser){
        throw new AppError('Email already in use', 409);
    }

    // Generate badge number
    const badgeNumber = await generateBadgeNumber();

    //Create officer 
    const officer = await User.create({
        email ,
        password,
        firstName,
        lastName,
        role: 'officer',
        department,
        badgeNumber,
        officerPhoto: photoPath,
        isEmailVerified: true, // Assuming officers are verified by default
        isActive: true, // Assuming officers are active by default
    });

    return {
        id: officer._id,
        email: officer.email,
        firstName: officer.firstName,
        lastName: officer.lastName,
        fullName: officer.fullName,
        role: officer.role,
        department: officer.department,
        badgeNumber: officer.badgeNumber,
        officerPhoto: officer.officerPhoto,
        isActive: officer.isActive,
        createdAt: officer.createdAt,
    }
};


const signUpService = require('./signUpService');
const catchAsync = require('../../../shared/utils/catchAsync');
const AppError = require('../../../shared/utils/AppError');

exports.signUpUser = catchAsync(async (req, res, next) => {
    const {email , password , firstName , lastName} = req.body;

    const user= await signUpService.signUpUser({email , password , firstName , lastName});

    res.status(201).json({
        status: 'success',
        // message: 'User registered successfully. Please check your email to verify your account.',
        message : 'User registered successfully' ,
        data: {
            user
        }
});
});
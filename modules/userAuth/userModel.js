const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { trim, maxLength, uppercase } = require('zod');
const { required } = require('zod/mini');
const { token } = require('morgan');

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false //This Excludes password from query results by default
    },
    firstName:{
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    role: {
        type: String,
        enum :{
            values: ['citizen', 'officer' , 'admin'],
            message: 'Role must be either citizen, officer, or admin'
        },
        default: 'citizen',
        required: [true, 'Role is required']
    },
    department: {
        type: String,
        required: function() {   //Means department is required only if role is officer
            return this.role === 'officer';
        },
        enum: {
            values: ['Police', 'Fire Department'],
            message: 'Department must be Police or Fire Department',
        }   
    },
    badgeNumber: {
        type: String,
        required: function() {
            return this.role === 'officer';
        },
        unique: function() {
            return this.role === 'officer';
        },
        sparse: true, // Allows unique index to work with null values
        trim: true,
        uppercase: true,
    },
    officerPhoto: {
        type: String,
        required: function() {
            return this.role === 'officer';
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isEmailVerified: {
        type: Boolean,
        default: true
    },

    //Email Verification Token and Expiry
    emailVerficationToken: {
        type: String,
        select: false
    },
    emailVerificationExpires: {
        type: Date,
        select: false
    },

    //Password Reset Token and Expiry
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },

    //Session Management - Refresh Token and Expiry
    refreshToken: [ //Array of refresh tokens to allow multiple sessions across devices - On your different devices ipad,mobile,...
        {
            token: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
            expires: {
                type: Date,
            }
        }
    ],

    lastLogin: {
        type: Date
    },  
    },
{
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
);

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ badgeNumber: 1 }, { sparse: true });

userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

//Send it in the Api response to the client to know if the user needs to upload a photo or not -if true show the component for the photo-
userSchema.virtual('requiresPhoto').get(function(){
    return this.role === 'officer';
})

userSchema.pre('save' , async function() {
    // if(!this.isModified('password')) {
    //     return next();
    // }
    if(this.password && this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
})

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;

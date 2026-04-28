const {z} = require('zod');

exports.signUpSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please use a valid email address')
        .transform((email) => email.toLowerCase().trim()),

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .regex( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, one number'),

    firstName: z
        .string()
        .min(1, 'First name is required')
        .max(50, 'First name cannot exceed 50 characters')
        .trim(),
    lastName: z
        .string()
        .min(1, 'Last name is required')
        .max(50, 'Last name cannot exceed 50 characters')
        .trim(),
});

const { z } = require('zod');

const createOfficerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .transform((email) => email.toLowerCase().trim()),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    ),
  
  firstName: z.string().min(1, 'First name is required').trim(),
  lastName: z.string().min(1, 'Last name is required').trim(),
  
  department: z.enum(['Police', 'Fire Department'], {
    message: 'Department must be Police or Fire Department',
  }),
});

module.exports = { createOfficerSchema };
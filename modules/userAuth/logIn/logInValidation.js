const { z } = require('zod');

exports.loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .transform((email) => email.toLowerCase().trim()),
  
  password: z
    .string()
    .min(1, 'Password is required'),
});

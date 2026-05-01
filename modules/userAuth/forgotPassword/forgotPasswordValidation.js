const { z } = require('zod');

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .transform((email) => email.toLowerCase().trim()),
});

module.exports = { forgotPasswordSchema };
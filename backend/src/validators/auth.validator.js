const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().trim().min(2).max(50),
  email: z.string().trim().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6)
});

module.exports = {
  registerSchema,
  loginSchema
};

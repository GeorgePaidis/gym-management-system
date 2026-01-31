import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
});

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  phone: z.string().optional()
});
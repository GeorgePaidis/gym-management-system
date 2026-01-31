import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  phone: z.string().optional(),
  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER")
});

export const updateUserSchema = createUserSchema.partial();
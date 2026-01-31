import { z } from 'zod';

const workoutClassSchema = z.object({
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  name: z.string().min(3)
});

export const createScheduleSchema = z.object({
  monday: z.array(workoutClassSchema).optional().default([]),
  tuesday: z.array(workoutClassSchema).optional().default([]),
  wednesday: z.array(workoutClassSchema).optional().default([]),
  thursday: z.array(workoutClassSchema).optional().default([]),
  friday: z.array(workoutClassSchema).optional().default([]),
  saturday: z.array(workoutClassSchema).optional().default([]),
  sunday: z.array(workoutClassSchema).optional().default([])
});

export const addClassSchema = z.object({
  day: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  name: z.string().min(3)
});

export const removeClassSchema = addClassSchema;
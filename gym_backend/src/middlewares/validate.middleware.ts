import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Επικύρωση δεδομένων εισόδου με χρήση Zod
export const validate = (schema: z.ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err: any) {
    return res.status(400).json({ 
      message: "Validation failed", 
      errors: err.errors
    });
  }
}
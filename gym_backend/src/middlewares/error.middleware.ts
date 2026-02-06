import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.message === "Email already exists") {
    return res.status(409).json({ message: err.message });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "Validation failed", errors: (err as any).errors });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid id format" });
  }

  if ((err as any).code === 11000) {
    return res.status(409).json({ message: "Duplicate value" });
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};

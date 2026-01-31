import { Request, Response, NextFunction } from "express";

// Έλεγχος ρόλου διαχειριστή
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
  
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Server error in authorization" });
  }
};
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthPayload } from '../models/auth.model';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

// Αυθεντικοποίηση με JWT token
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: 'Missing or invalid Authorization Header' });
  }

  const token = header.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Invalid Authorization Format' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
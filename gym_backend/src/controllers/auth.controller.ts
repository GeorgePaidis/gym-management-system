import { Request, Response, NextFunction } from "express";
import * as authService from '../services/auth.service';

// Είσοδος χρήστη
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    if (!result) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    
    res.status(200).json({ token: result.token, user: result.user });
  } catch (err) {
    next(err);
  }
};

// Εγγραφή νέου χρήστη
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstname, lastname, phone } = req.body;
    const result = await authService.register(email, password, firstname, lastname, phone);
    
    res.status(201).json({
      message: "User registered successfully",
      user: result
    });
  } catch (err) {
    next(err);
  }
};
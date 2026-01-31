import { Request, Response, NextFunction } from "express";
import * as userService from '../services/user.service';

// Λίστα όλων των χρηστών
export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.findAllUsers();
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json(err);
  }
};

// Ανάκτηση χρήστη με βάση το ID
export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.findUserById(req.params.id!);
    
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// Δημιουργία νέου χρήστη
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.createUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// Ενημέρωση χρήστη
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.updateUser(req.params.id!, req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// Διαγραφή χρήστη
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.deleteUser(req.params.id!);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// Ανάκτηση προφίλ χρήστη
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
  
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const result = await userService.findUserById(userId);
    
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
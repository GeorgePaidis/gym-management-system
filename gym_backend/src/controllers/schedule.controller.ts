import { Request, Response, NextFunction } from "express";
import * as scheduleService from '../services/schedule.service';

// Λήψη ολοκλήρου του προγράμματος
export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await scheduleService.getSchedule();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// Ενημέρωση ολόκληρου προγράμματος
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await scheduleService.updateSchedule(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// Προσθήκη νέου μαθήματος σε συγκεκριμένη ημέρα και ώρα
export const addClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { day, time, name } = req.body;
    const result = await scheduleService.addClassToDay(day, time, name);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// Αφαίρεση μαθήματος από ημέρα και ώρα
export const removeClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { day, time, name } = req.body;
    const result = await scheduleService.removeClassFromDay(day, time, name);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
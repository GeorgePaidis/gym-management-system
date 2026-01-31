import { ISchedule, IWorkoutClass } from '../models/schedule.model';
import { ScheduleRepository } from '../repositories/schedule.repository';

const scheduleRepository = new ScheduleRepository();

// Λήψη του προγράμματος
export const getSchedule = async () => {
  return scheduleRepository.get();
};

// Ενημέρωση του προγράμματος
export const updateSchedule = async (payload: Partial<ISchedule>) => {
  return scheduleRepository.update(payload);
};

// Προσθήκη νέου μαθήματος
export const addClassToDay = async (
  day: keyof ISchedule,
  time: string,
  name: string
) => {
  const newClass: IWorkoutClass = { time, name };
  
  return scheduleRepository.addClassToDay(day, newClass);
};

// Αφαίρεση μαθήματος
export const removeClassFromDay = async (
  day: keyof ISchedule,
  time: string,
  name: string
) => {
  return scheduleRepository.removeClassFromDay(day, time, name);
};
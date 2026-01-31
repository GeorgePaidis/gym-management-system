import Schedule, { ISchedule, IWorkoutClass } from '../models/schedule.model';

export class ScheduleRepository {
  async get(): Promise<ISchedule | null> {
    return Schedule.findOne().lean();
  }

  async update(data: Partial<ISchedule>): Promise<ISchedule | null> {
    return Schedule.findOneAndUpdate({}, data, { 
      new: true,
      upsert: true 
    }).lean();
  }

  async addClassToDay(day: keyof ISchedule, classData: IWorkoutClass): Promise<ISchedule | null> {
    return Schedule.findOneAndUpdate(
      {},
      { $push: { [day]: classData } },
      { new: true }
    ).lean();
  }

  async removeClassFromDay(day: keyof ISchedule, time: string, name: string): Promise<ISchedule | null> {
    return Schedule.findOneAndUpdate(
      {},
      { $pull: { [day]: { time, name } } },
      { new: true }
    ).lean();
  }
}
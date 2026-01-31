export interface IWorkoutClass {
  time: string;
  name: string;
}

export interface ISchedule {
  _id?: string;
  monday: IWorkoutClass[];
  tuesday: IWorkoutClass[];
  wednesday: IWorkoutClass[];
  thursday: IWorkoutClass[];
  friday: IWorkoutClass[];
  saturday: IWorkoutClass[];
  sunday: IWorkoutClass[];
  updatedAt?: Date;
  createdAt?: Date;
}
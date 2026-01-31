import { Schema, model, Document } from "mongoose";

export interface IWorkoutClass {
  time: string;
  name: string;
}

export interface ISchedule extends Document {
  monday: IWorkoutClass[];
  tuesday: IWorkoutClass[];
  wednesday: IWorkoutClass[];
  thursday: IWorkoutClass[];
  friday: IWorkoutClass[];
  saturday: IWorkoutClass[];
  sunday: IWorkoutClass[];
}

const WorkoutClassSchema = new Schema<IWorkoutClass>({
  time: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  }
}, { _id: false });

const ScheduleSchema = new Schema<ISchedule>({
  monday: { 
    type: [WorkoutClassSchema], 
    default: [] 
  },
  tuesday: { 
    type: [WorkoutClassSchema], 
    default: [] 
  },
  wednesday: { 
    type: [WorkoutClassSchema], 
    default: [] 
  },
  thursday: { 
    type: [WorkoutClassSchema], 
    default: [] 
  },
  friday: { 
    type: [WorkoutClassSchema], 
    default: [] 
  },
  saturday: { 
    type: [WorkoutClassSchema], 
    default: [] 
  },
  sunday: { 
    type: [WorkoutClassSchema], 
    default: [] 
  }
}, {
  timestamps: true
});

export default model<ISchedule>("Schedule", ScheduleSchema);
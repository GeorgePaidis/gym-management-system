import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phone?: string;
  role: "ADMIN" | "MEMBER";
  joinDate: Date;
}

const UserSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  firstname: { 
    type: String, 
    required: true 
  },
  lastname: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String 
  },
  role: { 
    type: String, 
    enum: ["ADMIN", "MEMBER"], 
    default: "MEMBER" 
  },
  joinDate: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

export default model<IUser>("User", UserSchema);
import User, { IUser } from '../models/user.model';
import { Types } from 'mongoose';

export class UserRepository {
  async findAll(): Promise<IUser[]> {
    return User.find().lean();
  }

  async findById(id: Types.ObjectId | string): Promise<IUser | null> {
    return User.findById(id).lean();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).lean();
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  async update(id: Types.ObjectId | string, userData: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, userData, { new: true }).lean();
  }

  async delete(id: Types.ObjectId | string): Promise<IUser | null> {
    return User.findByIdAndDelete(id).lean();
  }
}
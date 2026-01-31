import { AuthPayload } from '../models/auth.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserRepository } from '../repositories/user.repository';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRE = '7d';

const userRepository = new UserRepository();

// Σύνδεση χρήστη
export const login = async (email: string, password: string) => {
  const user = await userRepository.findByEmail(email);
  
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  const payload: AuthPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
  
  return {
    user: {
      _id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      role: user.role,
      joinDate: user.joinDate
    },
    token
  };
};

// Εγγραφή νέου χρήστη
export const register = async (
  email: string, 
  password: string, 
  firstname: string, 
  lastname: string, 
  phone?: string
) => {
  const existingUser = await userRepository.findByEmail(email);
  
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hash = await bcrypt.hash(password, 10);
  
  const userData: any = {
    email,
    password: hash,
    firstname,
    lastname,
    role: 'MEMBER'
  };
  
  if (phone) {
    userData.phone = phone;
  }
  
  const user = await userRepository.create(userData);

  return {
    _id: user._id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    phone: user.phone,
    role: user.role,
    joinDate: user.joinDate
  };
};
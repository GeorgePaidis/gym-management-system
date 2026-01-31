import { IUser } from '../models/user.model';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';

const SALT_ROUNDS = 10;
const userRepository = new UserRepository();

// Ανάκτηση όλων των χρηστών
export const findAllUsers = async () => {
  return userRepository.findAll();
};

// Ανάκτηση χρήστη με βάση ID
export const findUserById = async (id: string) => {
  return userRepository.findById(id);
};

// Ανάκτηση χρήστη με βάση email
export const findUserByEmail = async (email: string) => {
  return userRepository.findByEmail(email);
};

// Δημιουργία νέου χρήστη
export const createUser = async (payload: Partial<IUser>) => {
  if (payload.password) {
    const hash = await bcrypt.hash(payload.password, SALT_ROUNDS);
    payload.password = hash;
  }
  
  return userRepository.create(payload);
};

// Ενημέρωση χρήστη
export const updateUser = async (id: string, payload: Partial<IUser>) => {
  //Έλεγχος για διπλότυπο email
  if (payload.email) {
    const existingUser = await userRepository.findByEmail(payload.email);
    
    // Αν υπάρχει χρήστης με ίδιο email ΚΑΙ δεν είναι ο ίδιος χρήστης
    if (existingUser && existingUser._id?.toString() !== id) {
      throw new Error('Email already exists');
    }
  }
  
  if (payload.password) {
    const hash = await bcrypt.hash(payload.password, SALT_ROUNDS);
    payload.password = hash;
  }
  
  return userRepository.update(id, payload);
};

// Διαγραφή χρήστη
export const deleteUser = async (id: string) => {
  return userRepository.delete(id);
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
  
  const userData: Partial<IUser> = {
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
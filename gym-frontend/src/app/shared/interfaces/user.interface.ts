export interface IUser {
  _id?: string;
  email: string;
  password?: string;
  firstname: string;
  lastname: string;
  phone?: string;
  role: 'ADMIN' | 'MEMBER';
  joinDate?: Date;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface LoggedInUser {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: 'ADMIN' | 'MEMBER';
}
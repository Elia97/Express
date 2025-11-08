export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  age?: number;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  age?: number;
}

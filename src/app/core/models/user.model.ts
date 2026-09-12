import { Role } from './role.enum';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  department: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastAccess: string;
}

export interface UserFormValue {
  name: string;
  email: string;
  role: Role;
  department: string;
  status: 'ACTIVE' | 'INACTIVE';
}

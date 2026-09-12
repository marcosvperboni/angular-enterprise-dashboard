import { Role } from '../models/role.enum';

export interface DemoAccount {
  email: string;
  password: string;
  name: string;
  role: Role;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  { email: 'admin@dashboard.com', password: 'admin123', name: 'Ana Almeida', role: Role.Admin },
  { email: 'gestor@dashboard.com', password: 'gestor123', name: 'Bruno Barbosa', role: Role.Manager },
  { email: 'visitante@dashboard.com', password: 'visitante123', name: 'Carla Costa', role: Role.Viewer },
];

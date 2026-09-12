import { Role } from '../models/role.enum';
import { User } from '../models/user.model';

const DEPARTMENTS = ['Financeiro', 'Tecnologia', 'Comercial', 'Operações', 'RH', 'Marketing'];
const FIRST_NAMES = [
  'Ana', 'Bruno', 'Carla', 'Diego', 'Elisa', 'Fábio', 'Gabriela', 'Hugo', 'Isabela', 'João',
  'Karina', 'Lucas', 'Mariana', 'Nelson', 'Olívia', 'Pedro', 'Renata', 'Sérgio', 'Tatiane', 'Vitor',
  'Wesley', 'Ximena', 'Yasmin', 'Zeca',
];
const LAST_NAMES = [
  'Almeida', 'Barbosa', 'Costa', 'Dias', 'Ferreira', 'Gomes', 'Henrique', 'Ibrahim', 'Junqueira',
  'Klein', 'Lopes', 'Martins', 'Nogueira', 'Oliveira', 'Pereira', 'Queiroz', 'Ramos', 'Souza',
  'Teixeira', 'Uchoa', 'Vieira', 'Wagner', 'Xavier', 'Zamboni',
];
const ROLES = [Role.Admin, Role.Manager, Role.Viewer];

function buildUser(index: number): User {
  const first = FIRST_NAMES[index % FIRST_NAMES.length];
  const last = LAST_NAMES[(index * 7) % LAST_NAMES.length];
  const role = index === 0 ? Role.Admin : ROLES[index % ROLES.length];
  const daysAgo = (index * 13) % 90;
  const lastAccess = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

  return {
    id: index + 1,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@dashboard.com`,
    role,
    department: DEPARTMENTS[index % DEPARTMENTS.length],
    status: index % 5 === 0 ? 'INACTIVE' : 'ACTIVE',
    lastAccess,
  };
}

export const MOCK_USERS: User[] = Array.from({ length: 42 }, (_, index) => buildUser(index));

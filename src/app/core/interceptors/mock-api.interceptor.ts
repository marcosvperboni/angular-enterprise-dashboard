import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Observable, delay, of, throwError } from 'rxjs';
import { LoginRequest, LoginResponse, JwtPayload } from '../models/auth.model';
import { PagedResult, UserQueryParams } from '../models/paged-result.model';
import { Role } from '../models/role.enum';
import { User } from '../models/user.model';
import { DEMO_ACCOUNTS } from '../mock/demo-accounts.data';
import { MOCK_USERS } from '../mock/mock-users.data';
import { createMockJwt, decodeJwt, isJwtExpired } from '../utils/jwt.util';

const LATENCY_MS = 350;
const TOKEN_TTL_SECONDS = 60 * 60;
const users: User[] = [...MOCK_USERS];
let nextId = users.length + 1;

function respond<T>(body: T, status = 200): Observable<HttpResponse<T>> {
  return of(new HttpResponse({ body, status })).pipe(delay(LATENCY_MS));
}

function fail(status: number, message: string): Observable<never> {
  return throwError(() => new HttpErrorResponse({ status, error: { message } })).pipe(delay(LATENCY_MS));
}

function authenticate(authorizationHeader: string | null): JwtPayload | null {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null;
  }
  const payload = decodeJwt(authorizationHeader.replace('Bearer ', ''));
  return payload && !isJwtExpired(payload) ? payload : null;
}

function handleLogin(body: LoginRequest) {
  const account = DEMO_ACCOUNTS.find((a) => a.email === body.email && a.password === body.password);
  if (!account) {
    return fail(401, 'E-mail ou senha inválidos.');
  }
  const now = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = {
    sub: account.email,
    name: account.name,
    email: account.email,
    role: account.role,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  };
  const response: LoginResponse = { accessToken: createMockJwt(payload), expiresIn: TOKEN_TTL_SECONDS };
  return respond(response);
}

function handleUsersList(params: URLSearchParams) {
  const page = Number(params.get('page') ?? '0');
  const pageSize = Number(params.get('pageSize') ?? '10');
  const search = (params.get('search') ?? '').trim().toLowerCase();
  const role = params.get('role') ?? '';
  const status = params.get('status') ?? '';
  const sortField = (params.get('sortField') ?? '') as keyof User | '';
  const sortDirection = params.get('sortDirection') ?? '';

  let filtered = users.filter((user) => {
    const matchesSearch = !search || user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search);
    const matchesRole = !role || user.role === role;
    const matchesStatus = !status || user.status === status;
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (sortField && sortDirection) {
    const direction = sortDirection === 'asc' ? 1 : -1;
    filtered = [...filtered].sort((a, b) => (String(a[sortField]) > String(b[sortField]) ? direction : -direction));
  }

  const start = page * pageSize;
  const result: PagedResult<User> = {
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
  };
  return respond(result);
}

function handleStats() {
  return respond({
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === 'ACTIVE').length,
    admins: users.filter((u) => u.role === Role.Admin).length,
    newThisMonth: users.filter((u) => Date.now() - new Date(u.lastAccess).getTime() < 15 * 24 * 60 * 60 * 1000).length,
  });
}

function handleChart() {
  const months = ['Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'];
  return respond({
    accessByMonth: { labels: months, data: [312, 401, 389, 452, 498, 561] },
    roleDistribution: {
      labels: ['Admin', 'Gestor', 'Visitante'],
      data: [
        users.filter((u) => u.role === Role.Admin).length,
        users.filter((u) => u.role === Role.Manager).length,
        users.filter((u) => u.role === Role.Viewer).length,
      ],
    },
  });
}

function handleCreate(body: Omit<User, 'id' | 'lastAccess'>, caller: JwtPayload) {
  if (caller.role === Role.Viewer) {
    return fail(403, 'Visitantes não podem criar usuários.');
  }
  const created: User = { ...body, id: nextId++, lastAccess: new Date().toISOString() };
  users.unshift(created);
  return respond(created, 201);
}

function handleUpdate(id: number, body: Partial<User>, caller: JwtPayload) {
  if (caller.role === Role.Viewer) {
    return fail(403, 'Visitantes não podem editar usuários.');
  }
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return fail(404, 'Usuário não encontrado.');
  }
  users[index] = { ...users[index], ...body };
  return respond(users[index]);
}

function handleDelete(id: number, caller: JwtPayload) {
  if (caller.role !== Role.Admin) {
    return fail(403, 'Apenas administradores podem remover usuários.');
  }
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return fail(404, 'Usuário não encontrado.');
  }
  users.splice(index, 1);
  return respond(null);
}

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/')) {
    return next(req);
  }

  const url = new URL(req.url, window.location.origin);
  const path = url.pathname;

  if (path === '/api/auth/login' && req.method === 'POST') {
    return handleLogin(req.body as LoginRequest);
  }

  const caller = authenticate(req.headers.get('Authorization'));
  if (!caller) {
    return fail(401, 'Não autenticado.');
  }

  if (path === '/api/users' && req.method === 'GET') {
    return handleUsersList(url.searchParams);
  }
  if (path === '/api/users' && req.method === 'POST') {
    return handleCreate(req.body as Omit<User, 'id' | 'lastAccess'>, caller);
  }
  if (path === '/api/dashboard/stats' && req.method === 'GET') {
    return handleStats();
  }
  if (path === '/api/dashboard/chart' && req.method === 'GET') {
    return handleChart();
  }

  const userIdMatch = path.match(/^\/api\/users\/(\d+)$/);
  if (userIdMatch) {
    const id = Number(userIdMatch[1]);
    if (req.method === 'PUT') {
      return handleUpdate(id, req.body as Partial<User>, caller);
    }
    if (req.method === 'DELETE') {
      return handleDelete(id, caller);
    }
  }

  return fail(404, `Endpoint mock não implementado: ${req.method} ${path}`);
};

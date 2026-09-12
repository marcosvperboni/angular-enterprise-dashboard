import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { Role } from '../models/role.enum';
import { createMockJwt } from '../utils/jwt.util';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideRouter([])],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('starts unauthenticated when there is no stored token', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  it('stores the token and exposes claims after a successful login', () => {
    service.login({ email: 'admin@dashboard.com', password: 'admin123' }).subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    req.flush({ accessToken: createMockJwt(buildPayload(Role.Admin)), expiresIn: 3600 });

    expect(service.isAuthenticated()).toBe(true);
    expect(service.role()).toBe(Role.Admin);
    expect(localStorage.getItem('dashboard-token')).toBeTruthy();
  });

  it('hasAnyRole reflects the authenticated user role', () => {
    service.login({ email: 'gestor@dashboard.com', password: 'gestor123' }).subscribe();
    httpMock.expectOne('/api/auth/login').flush({ accessToken: createMockJwt(buildPayload(Role.Manager)), expiresIn: 3600 });

    expect(service.hasAnyRole([Role.Admin, Role.Manager])).toBe(true);
    expect(service.hasAnyRole([Role.Admin])).toBe(false);
  });

  it('clears the session on logout', () => {
    service.login({ email: 'admin@dashboard.com', password: 'admin123' }).subscribe();
    httpMock.expectOne('/api/auth/login').flush({ accessToken: createMockJwt(buildPayload(Role.Admin)), expiresIn: 3600 });

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('dashboard-token')).toBeNull();
  });

  function buildPayload(role: Role) {
    const now = Math.floor(Date.now() / 1000);
    return { sub: 'user@dashboard.com', name: 'Test User', email: 'user@dashboard.com', role, iat: now, exp: now + 3600 };
  }
});

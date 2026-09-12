import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, JwtPayload } from '../models/auth.model';
import { Role } from '../models/role.enum';
import { decodeJwt, isJwtExpired } from '../utils/jwt.util';

const TOKEN_KEY = 'dashboard-token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly claims = signal<JwtPayload | null>(this.readValidClaimsFromStorage());

  readonly currentUser = computed(() => this.claims());
  readonly isAuthenticated = computed(() => this.claims() !== null);
  readonly role = computed(() => this.claims()?.role ?? null);

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', request).pipe(
      tap((response) => {
        localStorage.setItem(TOKEN_KEY, response.accessToken);
        this.claims.set(decodeJwt(response.accessToken));
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.claims.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  hasAnyRole(roles: Role[]): boolean {
    const current = this.role();
    return current !== null && roles.includes(current);
  }

  private readValidClaimsFromStorage(): JwtPayload | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return null;
    }
    const payload = decodeJwt(token);
    if (!payload || isJwtExpired(payload)) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return payload;
  }
}

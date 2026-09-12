import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/role.enum';

describe('roleGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  function runGuard(roles: Role[]) {
    const route = { data: { roles } } as unknown as ActivatedRouteSnapshot;
    return TestBed.runInInjectionContext(() => roleGuard(route, {} as never));
  }

  it('allows navigation when the user has one of the required roles', () => {
    jest.spyOn(authService, 'hasAnyRole').mockReturnValue(true);

    expect(runGuard([Role.Admin])).toBe(true);
  });

  it('redirects to the forbidden page when the user lacks the required role', () => {
    jest.spyOn(authService, 'hasAnyRole').mockReturnValue(false);
    jest.spyOn(router, 'createUrlTree');

    runGuard([Role.Admin]);

    expect(router.createUrlTree).toHaveBeenCalledWith(['/dashboard/forbidden']);
  });

  it('allows navigation when the route declares no role restriction', () => {
    const route = { data: {} } as unknown as ActivatedRouteSnapshot;
    const result = TestBed.runInInjectionContext(() => roleGuard(route, {} as never));

    expect(result).toBe(true);
  });
});

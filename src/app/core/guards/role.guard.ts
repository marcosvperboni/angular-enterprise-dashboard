import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/role.enum';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = route.data['roles'] as Role[] | undefined;

  if (!allowedRoles || authService.hasAnyRole(allowedRoles)) {
    return true;
  }

  return router.createUrlTree(['/dashboard/forbidden']);
};

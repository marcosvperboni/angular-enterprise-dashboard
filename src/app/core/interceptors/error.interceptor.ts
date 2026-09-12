import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        notifications.error('Sessão expirada. Faça login novamente.');
      } else if (error.status === 403) {
        notifications.error('Você não tem permissão para executar esta ação.');
        router.navigate(['/dashboard/forbidden']);
      } else {
        notifications.error(error.error?.message ?? 'Ocorreu um erro inesperado. Tente novamente.');
      }
      return throwError(() => error);
    }),
  );
};

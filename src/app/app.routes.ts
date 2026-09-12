import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Role } from './core/models/role.enum';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/overview/overview.component').then((m) => m.OverviewComponent),
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./features/dashboard/users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'configuracoes',
        canActivate: [roleGuard],
        data: { roles: [Role.Admin] },
        loadComponent: () =>
          import('./features/dashboard/settings/settings.component').then((m) => m.SettingsComponent),
      },
      {
        path: 'forbidden',
        loadComponent: () =>
          import('./features/errors/forbidden/forbidden.component').then((m) => m.ForbiddenComponent),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./features/errors/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];

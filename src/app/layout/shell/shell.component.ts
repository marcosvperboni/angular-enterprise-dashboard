import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { Role } from '../../core/models/role.enum';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles?: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Visão geral', path: '/dashboard', icon: 'dashboard' },
  { label: 'Usuários', path: '/dashboard/usuarios', icon: 'group' },
  { label: 'Configurações', path: '/dashboard/configuracoes', icon: 'settings', roles: [Role.Admin] },
];

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);

  protected readonly currentUser = this.authService.currentUser;
  protected readonly navItems = computed(() =>
    NAV_ITEMS.filter((item) => !item.roles || this.authService.hasAnyRole(item.roles)),
  );

  logout(): void {
    this.authService.logout();
  }
}

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  template: `
    <h1 class="page-title">Configurações</h1>
    <mat-card appearance="outlined" class="settings-card">
      <mat-icon>admin_panel_settings</mat-icon>
      <p>
        Esta área é restrita ao perfil <strong>ADMIN</strong> e demonstra o controle de acesso por rota
        (<code>roleGuard</code>) combinado com <code>route.data.roles</code>.
      </p>
    </mat-card>
  `,
  styles: `
    .page-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 1.5rem;
    }
    .settings-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      max-width: 40rem;
    }
  `,
})
export class SettingsComponent {}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule],
  template: `
    <div class="state-page">
      <mat-icon class="state-icon">block</mat-icon>
      <h1>Acesso negado</h1>
      <p>Seu perfil não tem permissão para acessar esta área.</p>
      <a mat-flat-button color="primary" routerLink="/dashboard">Voltar ao painel</a>
    </div>
  `,
  styleUrl: '../state-page.scss',
})
export class ForbiddenComponent {}

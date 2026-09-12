import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule],
  template: `
    <div class="state-page">
      <mat-icon class="state-icon">search_off</mat-icon>
      <h1>Página não encontrada</h1>
      <p>O endereço acessado não existe ou foi movido.</p>
      <a mat-flat-button color="primary" routerLink="/dashboard">Voltar ao painel</a>
    </div>
  `,
  styleUrl: '../state-page.scss',
})
export class NotFoundComponent {}

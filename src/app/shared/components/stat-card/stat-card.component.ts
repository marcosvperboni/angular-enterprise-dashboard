import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  template: `
    <mat-card appearance="outlined" class="stat-card">
      <div class="icon-badge">
        <mat-icon>{{ icon() }}</mat-icon>
      </div>
      <div class="stat-body">
        <span class="value">{{ value() }}</span>
        <span class="label">{{ label() }}</span>
      </div>
    </mat-card>
  `,
  styles: `
    .stat-card {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      height: 100%;
    }

    .icon-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      border-radius: 12px;
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
      flex-shrink: 0;
    }

    .stat-body {
      display: flex;
      flex-direction: column;
    }

    .value {
      font-size: 1.75rem;
      font-weight: 600;
      line-height: 1.2;
    }

    .label {
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.85rem;
    }
  `,
})
export class StatCardComponent {
  readonly icon = input.required<string>();
  readonly value = input.required<string | number>();
  readonly label = input.required<string>();
}

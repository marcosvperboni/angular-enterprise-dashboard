import { Component, inject, signal } from '@angular/core';
import { DashboardChartData, DashboardService, DashboardStats } from '../../../core/services/dashboard.service';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { ChartCardComponent } from '../../../shared/components/chart-card/chart-card.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [StatCardComponent, ChartCardComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  private readonly dashboardService = inject(DashboardService);

  readonly stats = signal<DashboardStats | null>(null);
  readonly chartData = signal<DashboardChartData | null>(null);

  constructor() {
    this.dashboardService.getStats().subscribe((stats) => this.stats.set(stats));
    this.dashboardService.getChartData().subscribe((data) => this.chartData.set(data));
  }
}

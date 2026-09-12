import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  admins: number;
  newThisMonth: number;
}

export interface ChartSeries {
  labels: string[];
  data: number[];
}

export interface DashboardChartData {
  accessByMonth: ChartSeries;
  roleDistribution: ChartSeries;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>('/api/dashboard/stats');
  }

  getChartData(): Observable<DashboardChartData> {
    return this.http.get<DashboardChartData>('/api/dashboard/chart');
  }
}

import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  input,
  viewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

const PALETTE = ['#3f51b5', '#26a69a', '#ffb300', '#ef5350', '#8e24aa', '#00897b'];

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card appearance="outlined" class="chart-card">
      <h3 class="chart-title">{{ title() }}</h3>
      <div class="chart-canvas-wrapper">
        <canvas #canvas></canvas>
      </div>
    </mat-card>
  `,
  styles: `
    .chart-card {
      padding: 1.25rem;
      height: 100%;
    }

    .chart-title {
      margin: 0 0 1rem;
      font-size: 1rem;
      font-weight: 600;
    }

    .chart-canvas-wrapper {
      position: relative;
      height: 260px;
    }
  `,
})
export class ChartCardComponent implements AfterViewInit, OnDestroy {
  readonly title = input.required<string>();
  readonly type = input<ChartType>('bar');
  readonly labels = input<string[]>([]);
  readonly data = input<number[]>([]);

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private chart: Chart | null = null;

  constructor() {
    effect(() => {
      const labels = this.labels();
      const data = this.data();
      this.renderChart(labels, data);
    });
  }

  ngAfterViewInit(): void {
    this.renderChart(this.labels(), this.data());
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private renderChart(labels: string[], data: number[]): void {
    const canvas = this.canvasRef().nativeElement;
    const config: ChartConfiguration = {
      type: this.type(),
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: this.type() === 'line' ? 'rgba(63, 81, 181, 0.15)' : PALETTE,
            borderColor: this.type() === 'line' ? PALETTE[0] : '#ffffff',
            borderWidth: this.type() === 'doughnut' ? 2 : 1,
            fill: this.type() === 'line',
            tension: 0.35,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: this.type() === 'doughnut', position: 'bottom' } },
        scales: this.type() === 'doughnut' ? {} : { y: { beginAtZero: true } },
      },
    };

    if (this.chart) {
      this.chart.data = config.data;
      this.chart.update();
      return;
    }
    this.chart = new Chart(canvas, config);
  }
}

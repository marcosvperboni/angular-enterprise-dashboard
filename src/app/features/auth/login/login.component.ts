import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { DEMO_ACCOUNTS } from '../../../core/mock/demo-accounts.data';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly hidePassword = signal(true);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly demoAccounts = DEMO_ACCOUNTS;

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  fillDemo(email: string, password: string): void {
    this.form.setValue({ email, password });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.loading.set(true);

    this.authService
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
          this.router.navigateByUrl(redirectTo ?? '/dashboard');
        },
        error: () => this.errorMessage.set('E-mail ou senha inválidos.'),
      });
  }
}

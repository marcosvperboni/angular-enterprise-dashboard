import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { finalize } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { Role } from '../../../../core/models/role.enum';
import { User } from '../../../../core/models/user.model';

export interface UserFormDialogInput {
  mode: 'create' | 'edit';
  user?: User;
}

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './user-form-dialog.component.html',
  styleUrl: './user-form-dialog.component.scss',
})
export class UserFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly dialogRef = inject(MatDialogRef<UserFormDialogComponent>);
  protected readonly data = inject<UserFormDialogInput>(MAT_DIALOG_DATA);

  protected readonly roles = Object.values(Role);
  protected readonly saving = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control(this.data.user?.name ?? '', [Validators.required, Validators.minLength(3)]),
    email: this.fb.nonNullable.control(this.data.user?.email ?? '', [Validators.required, Validators.email]),
    role: this.fb.nonNullable.control(this.data.user?.role ?? Role.Viewer, [Validators.required]),
    department: this.fb.nonNullable.control(this.data.user?.department ?? '', [Validators.required]),
    status: this.fb.nonNullable.control<'ACTIVE' | 'INACTIVE'>(this.data.user?.status ?? 'ACTIVE', [
      Validators.required,
    ]),
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const value = this.form.getRawValue();
    const request$ =
      this.data.mode === 'create'
        ? this.userService.create(value)
        : this.userService.update(this.data.user!.id, value);

    request$.pipe(finalize(() => this.saving.set(false))).subscribe(() => this.dialogRef.close(true));
  }
}

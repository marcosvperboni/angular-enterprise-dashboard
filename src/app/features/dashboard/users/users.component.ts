import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, debounceTime, finalize, merge, startWith, switchMap } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Role } from '../../../core/models/role.enum';
import { User } from '../../../core/models/user.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UserFormDialogComponent } from './user-form-dialog/user-form-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  protected readonly roles = Object.values(Role);
  protected readonly displayedColumns = ['name', 'email', 'role', 'department', 'status', 'lastAccess', 'actions'];

  protected readonly filterForm = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    role: new FormControl('', { nonNullable: true }),
    status: new FormControl('', { nonNullable: true }),
  });

  private readonly sortState = new BehaviorSubject<Sort>({ active: '', direction: '' });
  private readonly pageState = new BehaviorSubject<PageEvent>({ pageIndex: 0, pageSize: 10, length: 0 });
  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  private readonly filters$ = this.filterForm.valueChanges.pipe(
    startWith(this.filterForm.getRawValue()),
    debounceTime(300),
  );

  protected readonly loading = signal(false);

  protected readonly pageResult = toSignal(
    combineLatest([this.filters$, this.sortState, this.pageState, this.refresh$]).pipe(
      switchMap(([filters, sort, page]) => {
        this.loading.set(true);
        return this.userService
          .list({
            page: page.pageIndex,
            pageSize: page.pageSize,
            search: filters.search,
            role: filters.role,
            status: filters.status,
            sortField: sort.direction ? sort.active : '',
            sortDirection: sort.direction,
          })
          .pipe(finalize(() => this.loading.set(false)));
      }),
    ),
    { initialValue: null },
  );

  constructor() {
    merge(this.filters$, this.sortState)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.pageState.next({ ...this.pageState.value, pageIndex: 0 }));
  }

  onPage(event: PageEvent): void {
    this.pageState.next(event);
  }

  onSortChange(sort: Sort): void {
    this.sortState.next(sort);
  }

  canEdit(): boolean {
    return this.authService.hasAnyRole([Role.Admin, Role.Manager]);
  }

  canDelete(): boolean {
    return this.authService.hasAnyRole([Role.Admin]);
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(UserFormDialogComponent, { width: '480px', data: { mode: 'create' } });
    ref.afterClosed().subscribe((created: boolean) => {
      if (created) {
        this.notifications.success('Usuário criado com sucesso.');
        this.refresh$.next();
      }
    });
  }

  openEditDialog(user: User): void {
    const ref = this.dialog.open(UserFormDialogComponent, { width: '480px', data: { mode: 'edit', user } });
    ref.afterClosed().subscribe((updated: boolean) => {
      if (updated) {
        this.notifications.success('Usuário atualizado com sucesso.');
        this.refresh$.next();
      }
    });
  }

  confirmDelete(user: User): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Remover usuário',
        message: `Tem certeza que deseja remover ${user.name}? Esta ação não pode ser desfeita.`,
        confirmLabel: 'Remover',
      },
    });
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.userService.remove(user.id).subscribe(() => {
        this.notifications.success('Usuário removido com sucesso.');
        this.refresh$.next();
      });
    });
  }
}

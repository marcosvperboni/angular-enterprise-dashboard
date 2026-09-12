import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult, UserQueryParams } from '../models/paged-result.model';
import { User, UserFormValue } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  list(query: UserQueryParams): Observable<PagedResult<User>> {
    let params = new HttpParams().set('page', query.page).set('pageSize', query.pageSize);
    if (query.search) params = params.set('search', query.search);
    if (query.role) params = params.set('role', query.role);
    if (query.status) params = params.set('status', query.status);
    if (query.sortField) params = params.set('sortField', query.sortField);
    if (query.sortDirection) params = params.set('sortDirection', query.sortDirection);

    return this.http.get<PagedResult<User>>('/api/users', { params });
  }

  create(value: UserFormValue): Observable<User> {
    return this.http.post<User>('/api/users', value);
  }

  update(id: number, value: UserFormValue): Observable<User> {
    return this.http.put<User>(`/api/users/${id}`, value);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`/api/users/${id}`);
  }
}

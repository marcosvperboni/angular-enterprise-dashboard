export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  role?: string;
  status?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc' | '';
}

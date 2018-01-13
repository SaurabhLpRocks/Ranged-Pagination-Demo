export interface PaginationOptions {
  pageNumberToOpen: number;
  paginationMoveDirection: number;
  query: object;
  rowPointer?: any;
  rowsPerPage: number;
  sort: object;
  sortField: string;
  sortOrder: number;
}

export interface PaginationRequestQueryString {
  currentPageFirstRowSortByFieldValue: any;
  currentPageNumber: number;
  filters: Object;
  pageNumberToRequest: number;
  paginationMoveDirection: number;
  rowsPerPage: number;
  sortField: string;
  sortOrder: number;
}


export interface TableSearchConfig {
    filters?: TableFilters;
    sortField: string;
    sortOrder: number;
    rowsPerPage: number;
    firstRowIndex: number;
    totalRecords: number;
    currentPageFirstRowSortByFieldValue?: string;
    currentPageNumber: number;
    pageNumberToRequest: number;
    paginationMoveDirection: TableMoveDirection;
    isSortOrFilterChanged: boolean;
}

export interface TableFilters {
    firstName?: TableFilter;
    lastName?: TableFilter;
}

export interface TableFilter {
    value: any;
    matchMode: any;
}

export enum TableMoveDirection {
    Next = 1,
    Back = -1,
}


import { PaginationRequestQueryString } from './pagination.interface';

export class PaginationHelper {
  retrieveTableSearchQueryParamsFromRequest(queryParams: Object): PaginationRequestQueryString {
    let filters: object;
    try {
      filters = JSON.parse(queryParams['filters']) || {};
    } catch (error) {
      filters = {};
    }
    return {
      filters,
      paginationMoveDirection: +queryParams['paginationMoveDirection'],
      currentPageFirstRowSortByFieldValue: queryParams['currentPageFirstRowSortByFieldValue'],
      currentPageNumber: +queryParams['currentPageNumber'],
      pageNumberToRequest: +queryParams['pageNumberToRequest'],
      rowsPerPage: +queryParams['rowsPerPage'],
      sortField: queryParams['sortField'],
      sortOrder: +queryParams['sortOrder'],
    };
  }

  transformPrimeNgDtFiltersToMongooseQuery(tableFilters: object): any {
    const mongooseQuery: any = {};
    if (tableFilters) {
      for (const searchField in tableFilters) {
        if (tableFilters[searchField]) {
          const pattern: string = `*.${tableFilters[searchField].value}.*`;
          const regEx1 = { $regex: new RegExp(/"*.test.*"/i) };
          const regEx = { $regex: tableFilters[searchField].value, $options: 'i' };
          mongooseQuery[searchField] = regEx;
        }
      }
    }
    return mongooseQuery;
  }
}

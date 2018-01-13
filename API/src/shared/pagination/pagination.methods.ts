import { PaginationOptions } from './pagination.interface';
import * as _ from 'lodash';
import { Promise, Types } from 'mongoose';

export class PaginationMethods {
  private self: any;
  constructor() {
    this.self = this;
  }

  getFirstPageFirstRecord: (options: PaginationOptions) => Promise<any> = function (options: PaginationOptions): Promise<any> {
    return this.findOne(options.query).sort(options.sort);
  };

  changePage: (options: PaginationOptions) => Promise<any> = function (options: PaginationOptions): Promise<any> {
    return this.findTotalRecordsCount(options).then((count) => {
      if (!count) {
        return this.addTotalRecordsCountToRecordsRes([], 0);
      } else {
        if (!options.rowPointer) {
          return this.getFirstPageFirstRecord(options).then((firstRecord: any) => {
            // options.rowPointer = firstRecord.id;
            options.rowPointer = firstRecord[options.sortField];
            return this.findRecords(options, count);
          });
        } else {
          return this.findRecords(options, count);
        }
      }
    });
  };

  findRecords: (options: PaginationOptions, count: number) => Promise<any> =
    function (options: PaginationOptions, count: number): Promise<any> {
      if (options.paginationMoveDirection === 1) {
        return this.findNextRecords(options).then((records: any[]) => {
          return this.addTotalRecordsCountToRecordsRes(records, count);
        });
      } else {
        return this.findPreviousRecords(options).then((records: any[]) => {
          return this.addTotalRecordsCountToRecordsRes(records, count);
        });
      }
    };

  // go to page current+N
  findNextRecords: (options: PaginationOptions) => Promise<any> = function (options: PaginationOptions): Promise<any> {
    let query = {};
    if (options.sortOrder === 1) {
      query = this.formMoveForwardAcsSortedPaginationQuery(options);
    } else {
      query = this.formMoveForwardDescSortedPaginationQuery(options);
    }
    return this.findRecord(query, options);
  };

  findPreviousRecords: (options: PaginationOptions) => Promise<any> = function (options: PaginationOptions): Promise<any> {
    let query = {};
    if (options.sortOrder === 1) {
      query = this.formMoveBackwardAcsSortedPaginationQuery(options);
    } else {
      query = this.formMoveBackwardDescSortedPaginationQuery(options);
    }
    return this.findRecord(query, options);
  };

  findRecord: (query: object, options) => Promise<any> = function (query: object, options: PaginationOptions): Promise<any> {
    return this.find(query).
      skip(options.pageNumberToOpen * options.rowsPerPage).
      limit(options.rowsPerPage).
      sort(options.sort);
  };


  formMoveForwardAcsSortedPaginationQuery: (options: PaginationOptions) => object = function (options: PaginationOptions): object {
    const pointerQuery = {};
    if (options.sortField === '_id') {
      pointerQuery[options.sortField] = { $gte: Types.ObjectId(options.rowPointer) };
    } else {
      pointerQuery[options.sortField] = { $gte: options.rowPointer };
    }
    return _.merge(pointerQuery, options.query);
  };


  formMoveBackwardAcsSortedPaginationQuery: (options: PaginationOptions) => object = function (options: PaginationOptions): object {
    const pointerQuery = {};
    if (options.sortField === '_id') {
      pointerQuery[options.sortField] = { $lt: Types.ObjectId(options.rowPointer) };
    } else {
      pointerQuery[options.sortField] = { $lt: options.rowPointer };
    }
    return _.merge(pointerQuery, options.query);
  };

  formMoveForwardDescSortedPaginationQuery: (options: PaginationOptions) => object = function (options: PaginationOptions): object {
    const pointerQuery = {};
    if (options.sortField === '_id') {
      pointerQuery[options.sortField] = { $lte: Types.ObjectId(options.rowPointer) };
    } else {
      pointerQuery[options.sortField] = { $lte: options.rowPointer };
    }
    return _.merge(pointerQuery, options.query);
  };

  formMoveBackwardDescSortedPaginationQuery: (options: PaginationOptions) => object = function (options: PaginationOptions): object {
    const pointerQuery = {};
    if (options.sortField === '_id') {
      pointerQuery[options.sortField] = { $gte: Types.ObjectId(options.rowPointer) };
    } else {
      pointerQuery[options.sortField] = { $gte: options.rowPointer };
    }
    return _.merge(pointerQuery, options.query);
  };

  findTotalRecordsCount: (options: PaginationOptions) => Promise<Number> = function (options: PaginationOptions): Promise<Number> {
    return this.count(options.query).exec();
  };

  addTotalRecordsCountToRecordsRes: (records: any[], count: number) => any = function (records: any[], count: number): any {
    return {
      data: records,
      totalRecords: count,
    };
  };
}

import 'rxjs/add/operator/takeUntil';

import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { TableMoveDirection, TableSearchConfig } from './table.search.config.interface';

import { AppService } from './app.service';
import { FilterEvent } from './filterEvent.interface';
import { LazyLoadEvent } from 'primeng/primeng';
import { PaginateEvent } from './paginateEvent.interface';
import { SortEvent } from './sortEvent.interface';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { TableConfig } from './tableConfig.interface';
import { TimeFromNow } from './timeFromNow.pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AppService, TimeFromNow],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  busy: Subscription;
  tableSearchConfig: TableSearchConfig = <TableSearchConfig>{};
  table: any[] = [];


  index: AbstractControl;
  name: AbstractControl;
  userId: AbstractControl;
  mobile: AbstractControl;
  taskDate: AbstractControl;
  taskForm: FormGroup;
  addTaskResponse: any;
  taskPostCount = 0;
  private unsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(private appService: AppService, private timeFromNow: TimeFromNow, private ref: ChangeDetectorRef, fb: FormBuilder) {
    this.taskForm = fb.group({
      'index': ['', Validators.compose([])],
      'name': ['', Validators.compose([])],
      'userId': ['', Validators.compose([])],
      'mobile': ['', Validators.compose([])],
      'taskDate': ['', Validators.compose([])],
    });
    this.index = this.taskForm.controls['index'];
    this.name = this.taskForm.controls['name'];
    this.userId = this.taskForm.controls['userId'];
    this.mobile = this.taskForm.controls['mobile'];
    this.taskDate = this.taskForm.controls['taskDate'];
    this.setTableSearchConfig();
  }

  ngOnInit() {
    this.addBulkTasksOnLoad();
  }

  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
    this.unsubscribe.unsubscribe();
  }

  addBulkTasksOnLoad() {
    this.busy = this.appService.addTaskOnLoad().subscribe((res: any) => {
      this.loadTable();
    }, (err: any) => {
    });
  }

  onPageChanged(event: PaginateEvent) {
    this.setTableSearchConfig(event, null, null,
      this.tableSearchConfig.currentPageNumber,
      this.tableSearchConfig.totalRecords);
    this.loadTable(event, null, null);
  }

  addTask(taskForm: any) {
    this.taskPostCount++;
    this.appService.addTask(taskForm).takeUntil(this.unsubscribe).subscribe((res: any) => {
      this.addTaskResponse = res;
    },
      err => {
        this.addTaskResponse = err;
      });
  }

  onTableColumnSortChanged(event: SortEvent) {
    this.setTableSearchConfig(null, event, null,
      this.tableSearchConfig.currentPageNumber,
      this.tableSearchConfig.totalRecords);
    this.loadTable(null, event, null);
  }

  onColumnFilterChanged(event: FilterEvent) {
    this.setTableSearchConfig(null, null, event,
      this.tableSearchConfig.currentPageNumber,
      this.tableSearchConfig.totalRecords);
    this.loadTable(null, null, event);
  }

  loadTable(paginateEvent?: PaginateEvent, sortEvent?: SortEvent, filterEvent?: FilterEvent) {
    this.appService.getTable(this.tableSearchConfig).takeUntil(this.unsubscribe).subscribe((res: any) => {
      for (const history of res.data) {
        history.updatedAt = this.timeFromNow.transform(history.updatedAt);
      }
      this.table = res.data;
      this.setTableSearchConfig(paginateEvent, sortEvent, filterEvent, this.tableSearchConfig.pageNumberToRequest, res.totalRecords);
      this.ref.detectChanges();
    });
  }

  clearTableSearchConfig() {
    this.tableSearchConfig = <TableSearchConfig>{};
  }

  setTableSearchConfig(paginateEvent?: PaginateEvent, sortEvent?: SortEvent, filterEvent?: FilterEvent,
    currentPage?: number, totalRecords?: number): void {

    const isSortOrFilterChanged = this.isSortOrFilterChanged(sortEvent, filterEvent);

    this.tableSearchConfig.firstRowIndex = (paginateEvent) ? paginateEvent.first : 0;

    this.tableSearchConfig.totalRecords = (!totalRecords) ? 0 : totalRecords;

    this.tableSearchConfig.currentPageNumber = (!currentPage || isSortOrFilterChanged) ? 1 : currentPage;

    this.tableSearchConfig.paginationMoveDirection = (paginateEvent)
      ? this.getNextPageOrPreviousPage(paginateEvent, this.tableSearchConfig.currentPageNumber)
      : TableMoveDirection.Next;

    this.tableSearchConfig.pageNumberToRequest = (paginateEvent) ? this.getPrimeNgDtRequestedPageNumber(paginateEvent) : 1;

    this.setCurrentPageFirstItem(isSortOrFilterChanged);

    if (paginateEvent) {
      this.tableSearchConfig.rowsPerPage = paginateEvent.rows;
    } else if (!this.tableSearchConfig.rowsPerPage) {
      this.tableSearchConfig.rowsPerPage = 10;
    }

    if (sortEvent) {
      this.tableSearchConfig.sortField = sortEvent.field;
      this.tableSearchConfig.sortOrder = sortEvent.order;
    } else if (!this.tableSearchConfig.sortField) {
      this.tableSearchConfig.sortField = 'taskDate';
      this.tableSearchConfig.sortOrder = 1;
    }

    if (filterEvent && this.isNotEmptyObject(filterEvent.filters)) {
      this.tableSearchConfig.filters = filterEvent.filters;
    } else if (filterEvent && !this.isNotEmptyObject(filterEvent.filters)) {
      delete this.tableSearchConfig.filters;
    }
  }


  getNextPageOrPreviousPage(event: PaginateEvent, currentPage: number): TableMoveDirection {
    if (!event || !currentPage) {
      return TableMoveDirection.Next;
    }
    const requestedPageNumber: number = this.getPrimeNgDtRequestedPageNumber(event);
    if (requestedPageNumber >= currentPage) {
      return TableMoveDirection.Next;
    } else {
      return TableMoveDirection.Back;
    }
  }

  getPrimeNgDtRequestedPageNumber(event: PaginateEvent): number {
    return (event.first / event.rows) + 1;
  }

  isSortOrFilterChanged(sortEvent?: SortEvent, filterEvent?: FilterEvent): boolean {
    return this.isNotEmptyObject(sortEvent) || this.isNotEmptyObject(filterEvent);
  }

  setCurrentPageFirstItem(isSortOrFilterChanged: boolean): void {
    if (!isSortOrFilterChanged) {
      if (this.table && this.table.length > 0
        && this.isNotEmptyObject(this.table[0])) {
        this.tableSearchConfig.currentPageFirstRowSortByFieldValue =
          this.table[0][this.tableSearchConfig.sortField];
      }
    } else {
      this.tableSearchConfig.currentPageFirstRowSortByFieldValue = '';
    }
  }

  isTableVisible() {
    return !!this.table && !!this.tableSearchConfig && this.isNotEmptyObject(this.tableSearchConfig);
  }

  isNotEmptyObject(object: object): boolean {
    for (const prop in object) {
      if (Object.prototype.hasOwnProperty.call(object, prop)) {
        return true;
      }
    }
    return false;
  }

}

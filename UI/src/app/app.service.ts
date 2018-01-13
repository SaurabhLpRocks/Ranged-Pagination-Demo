import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/throw';

import { Http, RequestOptions, Response } from '@angular/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TableSearchConfig } from './table.search.config.interface';

// import { Observable } from 'rxjs/Rx'; imported Observable, map, catch and finally separately instead of importing complete rxjs


@Injectable()
export class AppService {
  constructor(public http: Http) { }

  getTable(searchConfig: any): Observable<any> {
    const requestOptions = new RequestOptions();
    requestOptions.search = searchConfig;
    return this.http.get('http://localhost:5000/api/task', requestOptions).map((res: any) => {
      return res.json();
    })
      .catch((error: Response) => Observable.throw(error))
      .finally(() => {
      });
  }


  addTaskOnLoad(): Observable<any> {
    return this.http.put('http://localhost:5000/api/task', {}).map((res: Response) => {
      return res.text();
    })
      .catch((error: Response) => Observable.throw(error))
      .finally(() => {
      });
  }

  addTask(task: any): Observable<any> {
    return this.http.post('http://localhost:5000/api/task', task).map((res: any) => {
      return res.json();
    })
      .catch((error: Response) => Observable.throw(error.json()))
      .finally(() => {
      });
  }
}

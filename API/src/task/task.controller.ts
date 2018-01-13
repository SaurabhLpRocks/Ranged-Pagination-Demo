import * as Boom from 'boom';
import * as Hapi from 'hapi';
import * as moment from 'moment';

import { ApiHelperService } from '../shared/helper.service';
import { IDatabase } from '../shared/database';
import { ITask } from './task';
import { PaginationHelper } from '../shared/pagination/pagination.helper.service';
import { PaginationOptions } from '../shared/pagination/pagination.interface';
import { TaskDao } from './task.dao';
import { TaskService } from './task.service';

export default class TaskController {
  private taskDao: TaskDao;
  private apiHelperService: ApiHelperService;
  private paginationHelperService: PaginationHelper;
  private taskService: TaskService;
  private database: IDatabase;
  constructor(database: IDatabase) {
    this.database = database;
    this.taskDao = new TaskDao(database);
    this.taskService = new TaskService();
    this.apiHelperService = new ApiHelperService();
    this.paginationHelperService = new PaginationHelper();
  }

  async createTasksOnLoad(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      const existingTasksCount = await this.taskDao.getTotalTasksCount();
      if (existingTasksCount <= 0) {
        const tasks: any[] = this.taskService.createMultipleRandomTasks();
        for (let i = 0, len = tasks.length; i < len; i += 50000) {
          const newTasks = await this.taskDao.createTask(tasks.slice(i, i + 50000)).catch(err => console.log('db err', err));
        }
        return reply(`Creating ${tasks.length} tasks completed `).code(200);

      } else {
        return reply(`${existingTasksCount} tasks already exist, skipping adding tasks.`).code(200);

      }
    } catch (error) {
      return reply(Boom.badImplementation(error));
    }
  }
  async createTasks(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      const task: ITask = request.payload;
      task.mobileNormalized = task.mobile.toString();
      const newTask = await this.taskDao.createTask([task]);
      return reply(newTask).code(200);
    } catch (error) {
      console.log('error ', error);
      return reply(Boom.badImplementation(error));
    }
  }

  async getTasks(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      const queryParams = this.paginationHelperService.retrieveTableSearchQueryParamsFromRequest(request.query);

      // Since searching substring not possible for Integer field use the normalzed field
      if (queryParams.filters['mobile']) {
        const searchMobileSubstring = queryParams.filters['mobile'].value;
        delete queryParams.filters['mobile'];
        queryParams.filters['mobileNormalized'] = { value: searchMobileSubstring };
      }

      const mongooseQuery = this.paginationHelperService.transformPrimeNgDtFiltersToMongooseQuery(queryParams.filters);
      const sort = {};
      sort[queryParams.sortField] = queryParams.sortOrder;
      const options: PaginationOptions = {
        query: mongooseQuery,
        pageNumberToOpen: queryParams.pageNumberToRequest - 1,
        rowsPerPage: queryParams.rowsPerPage,
        sortField: queryParams.sortField,
        sortOrder: queryParams.sortOrder,
        paginationMoveDirection: queryParams.paginationMoveDirection,
        sort,
      };

      if (queryParams.currentPageFirstRowSortByFieldValue) {
        options.rowPointer = queryParams.currentPageFirstRowSortByFieldValue;
      }

      const response = await this.taskDao.getTaskByTableId(options);
      return reply(response).code(200);
    } catch (error) {
      return reply(Boom.badImplementation(error));
    }
  }
}

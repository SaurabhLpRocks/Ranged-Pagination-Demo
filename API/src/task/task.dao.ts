import { DocumentQuery } from 'mongoose';
import { IDatabase } from '../shared/database';
import { IServerConfigurations } from './../configurations/index';
import { ITask } from './task';
import { Promise } from 'mongoose';

export class TaskDao {
  private database: IDatabase;
  private configs: IServerConfigurations;

  constructor(database: IDatabase) {
    this.database = database;
  }

  getTotalTasksCount(): Promise<number> {
    return this.database.taskModel.count({}).exec();
  }

  createTask(newTaskPayload: ITask[]): Promise<ITask[]> {
    return this.database.taskModel.insertMany(newTaskPayload);
  }
  getTaskByTableId(options: any): Promise<any> {
    return this.database.taskModel['changePage'](options);
  }
}

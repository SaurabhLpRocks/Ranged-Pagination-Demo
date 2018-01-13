import * as Mongoose from 'mongoose';
import { IDataConfiguration } from '../configurations';
import { ITask, TaskModel } from '../task/task';

export interface IDatabase {
  taskModel: Mongoose.Model<ITask>;
}

export function init(config: IDataConfiguration): IDatabase {

  (<any>Mongoose).Promise = Promise;
  Mongoose.connect(process.env.MONGO_URL || config.connectionString);

  const mongoDb = Mongoose.connection;

  mongoDb.on('error', () => {
    console.log(`Unable to connect to database: ${config.connectionString}`);
  });

  mongoDb.once('open', () => {
    console.log(`Connected to database: ${config.connectionString}`);
  });

  return {
    taskModel: TaskModel,
  };
}

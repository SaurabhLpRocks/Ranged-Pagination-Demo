import * as Mongoose from 'mongoose';
import * as _ from 'lodash';

import { BaseModel } from '../shared/base.model';
import { BaseMongooseSchema } from '../shared/baseMongoose.schema';
import { PaginationMethods } from '../shared/pagination/pagination.methods';

export interface ITask extends Mongoose.Document, BaseModel {
  index: number;
  name: string;
  userId: string;
  mobile: number;
  mobileNormalized: string;
  taskDate: Date;
}

export const taskSchema: Mongoose.Schema = new Mongoose.Schema(
  _.merge({
    index: { type: Number, required: true },
    name: { type: String, required: true },
    userId: { type: String, required: true },
    mobile: { type: Number, required: true },
    mobileNormalized: { type: String, required: true },
    taskDate: { type: Date, required: true },
  }, BaseMongooseSchema),
  {
    timestamps: true,
    collection: 'task',
  });

taskSchema.index({ index: 1 }, { unique: true });
taskSchema.index({ name: 1 }, { unique: false });
taskSchema.index({ mobile: 1 }, { unique: false });
taskSchema.index({ taskDate: 1 }, { unique: false });

_.merge(taskSchema.statics, new PaginationMethods());

export const TaskModel = Mongoose.model<ITask>('taskSchema', taskSchema);

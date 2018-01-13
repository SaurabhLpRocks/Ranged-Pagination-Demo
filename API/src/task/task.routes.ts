import * as Hapi from 'hapi';
import * as Joi from 'joi';
import * as createTaskValidator from './task.validator';

import { IDatabase } from '../shared/database';
import { IServerConfigurations } from '../configurations';
import TaskController from './task.controller';

export default function (server: Hapi.Server, configs: IServerConfigurations, database: IDatabase) {
  const taskController = new TaskController(database);
  // taskController.createTasksOnLoad();
  server.bind(taskController);

  server.route({
    method: 'PUT',
    path: '/task',
    config: {
      handler: taskController.createTasksOnLoad,
      tags: ['api', 'task'],
      description: 'Add bulk tasks',
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': {
              'description': 'Added task.',
            },
          },
        },
      },
    },
  });

  server.route({
    method: 'POST',
    path: '/task',
    config: {
      handler: taskController.createTasks,
      tags: ['api', 'task'],
      description: 'Add Tasks',
      validate: {
        payload: createTaskValidator.createTaskModel,
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': {
              'description': 'Added task.',
            },
          },
        },
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/task',
    config: {
      handler: taskController.getTasks,
      tags: ['api', 'tasks'],
      description: 'Get tasks.',
      validate: {
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'tasks founded.',
            },
            '404': {
              'description': 'tasks do not exists.',
            },
          },
        },
      },
    },
  });
}

import * as Hapi from 'hapi';

import { IServerConfigurations } from '../configurations';
import { IDatabase } from '../shared/database';
import Routes from './task.routes';


export function init(server: Hapi.Server, configs: IServerConfigurations, database: IDatabase) {
  Routes(server, configs, database);
}

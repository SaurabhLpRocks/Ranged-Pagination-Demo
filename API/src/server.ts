import * as Hapi from 'hapi';
import * as Task from './task';

import { IDatabase } from './shared/database';
import { IPlugin } from './plugins/interfaces';
import { IServerConfigurations } from './configurations';

export function init(configs: IServerConfigurations, database: IDatabase): Promise<Hapi.Server> {

  return new Promise<Hapi.Server>(resolve => {

    const port = process.env.PORT || configs.port;
    const server = new Hapi.Server();

    server.connection({
      port,
      routes: {
        cors: {
          origin: ['*'],
          // additionalHeaders: ['cache-control', 'x-requested-with']
        },
      },
    });

    if (configs.routePrefix) {
      server.realm.modifiers.route.prefix = configs.routePrefix;
    }

    //  Setup Hapi Plugins
    const plugins: string[] = configs.plugins;
    const pluginOptions = {
      database,
      serverConfigs: configs,
    };

    const pluginPromises = [];

    plugins.forEach((pluginName: string) => {
      const plugin: IPlugin = (require(`./plugins/${pluginName}`)).default();
      // console.log(`Register Plugin ${plugin.info().name} v${plugin.info().version}`);
      pluginPromises.push(plugin.register(server, pluginOptions));
    });

    Promise.all(pluginPromises).then(() => {
      // console.log('All plugins registered successfully.');

      // console.log('Register Routes');
      Task.init(server, configs, database);
      // console.log('Routes registered successfully.');
      resolve(server);
    });
  });
}

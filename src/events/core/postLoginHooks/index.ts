import { ClientEvent, Logger } from '../../../lib';
import registerCommands from './registerCommands';

export const postLoginHooks = new ClientEvent({
  name: 'Post Login Hooks',
  type: 'ready',
  once: true,
  handler: async (client) => {
    // Fetch client's application to get the owners
    client.emit('debug', 'Fetching client application.');
    await client.application.fetch();

    // Register commands
    await registerCommands(client);

    // Log we are ready
    Logger.info(`${client.user.username} is online.`);
  },
});

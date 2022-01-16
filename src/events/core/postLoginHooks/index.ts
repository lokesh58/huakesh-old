import { ClientEvent, Logger } from '../../../lib';
import registerCommands from './registerCommands';

export const postLoginHooks = new ClientEvent({
  name: 'Post Login Hooks',
  type: 'ready',
  once: true,
  handler: async (client) => {
    await registerCommands(client);
    Logger.info(`${client.user.username} is online.`);
  },
});

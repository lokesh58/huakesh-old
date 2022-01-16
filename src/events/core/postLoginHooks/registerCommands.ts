import { ApplicationCommand, ApplicationCommandData, Client } from 'discord.js';
import { InvalidIDError, Logger, Structures } from '../../../lib';

export default async (client: Client<true>) => {
  client.emit('debug', 'Registering Commands.');
  const testGuildId = process.env.TEST_GUILD_ID;
  const commandsData = client.commands.map((cmd) => cmd.toJSON());
  if (testGuildId) {
    // If test guild is specified, set guild commands to it
    const testGuild = client.guilds.cache.get(testGuildId);
    if (!testGuild) throw new InvalidIDError(Structures.GUILD, testGuildId);

    await testGuild.commands.set(commandsData);
    Logger.info(
      'Registered following commands to test guild:',
      commandsData.map((d) => d.name),
    );
  } else {
    // Else update global commands
    const currentCommands = await client.application.commands.fetch();

    const toCreate = commandsData.filter((d) => currentCommands.every((cmd) => d.name !== cmd.name));
    const toUpdate: [ApplicationCommand, typeof commandsData[number]][] = [];
    const toDelete: ApplicationCommand[] = [];

    currentCommands.forEach((cmd) => {
      const data = commandsData.find((d) => d.name === cmd.name);
      if (!data) {
        toDelete.push(cmd);
        // TODO: Remove the type conversion hack below once d.js typings are fixed
      } else if (!cmd.equals(data as unknown as ApplicationCommandData, true)) {
        toUpdate.push([cmd, data]);
      }
    });

    const changes = toCreate.length + toUpdate.length + toDelete.length;
    if (changes < client.commandRegistrationOverwriteThreshold) {
      if (toCreate.length) {
        await Promise.all(toCreate.map((d) => client.application.commands.create(d)));
        Logger.info(
          'Created following global commands:',
          toCreate.map((d) => d.name),
        );
      }
      if (toUpdate.length) {
        // TODO: Remove the type conversion hack below once d.js typings are fixed
        await Promise.all(toUpdate.map(([cmd, data]) => cmd.edit(data as unknown as ApplicationCommandData)));
        Logger.info(
          'Updated following global commands:',
          toUpdate.map(([cmd]) => cmd.name),
        );
      }
      if (toDelete.length) {
        await Promise.all(toDelete.map((cmd) => cmd.delete()));
        Logger.info(
          'Deleted following global commands:',
          toDelete.map((cmd) => cmd.name),
        );
      }
    } else {
      await client.application.commands.set(commandsData);
      Logger.info(
        'Registered following global commands:',
        commandsData.map((d) => d.name),
      );
    }
  }
};

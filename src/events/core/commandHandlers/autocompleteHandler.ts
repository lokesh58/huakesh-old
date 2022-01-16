import {
  ClientEvent,
  CommandTypeMismatchError,
  CommandTypes,
  Entities,
  NotImplementedError,
  UnknownCommandError,
} from '../../../lib';

export const autocompleteHandler = new ClientEvent({
  name: 'Autocomplete Handler',
  type: 'interactionCreate',
  handler: async (interaction) => {
    if (!interaction.isAutocomplete()) return;
    const { client, commandName, commandId } = interaction;
    const cmd = client.commands.get(commandName);
    if (!cmd) throw new UnknownCommandError(CommandTypes.SLASH_COMMAND, commandName, commandId);
    if (!cmd.isSlashCommand()) {
      throw new CommandTypeMismatchError(commandName, commandId, cmd.type, CommandTypes.SLASH_COMMAND);
    }
    if (!cmd.autocompleteHandler) throw new NotImplementedError(Entities.COMMAND, commandName, 'autocompleteHandler');
    await cmd.autocompleteHandler(interaction);
  },
});

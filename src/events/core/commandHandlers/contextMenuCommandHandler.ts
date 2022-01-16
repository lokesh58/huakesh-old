import {
  ClientEvent,
  CommandTypeMismatchError,
  CommandTypes,
  Constants,
  Logger,
  UnknownCommandError,
  UserDisplayableError,
  Utils,
} from '../../../lib';

export const contextMenuCommandHandler = new ClientEvent({
  name: 'Context Menu Command Handler',
  type: 'interactionCreate',
  handler: async (interaction) => {
    if (!interaction.isContextMenu()) return;
    const { client, commandName, commandId } = interaction;
    try {
      const cmd = client.commands.get(commandName);
      if (!cmd) throw new UnknownCommandError(CommandTypes.CONTEXT_MENU_COMMAND, commandName, commandId);
      if (!cmd.isContextMenuCommand()) {
        throw new CommandTypeMismatchError(commandName, commandId, cmd.type, CommandTypes.CONTEXT_MENU_COMMAND);
      }
      cmd.checkPermissions(interaction);
      await cmd.handler(interaction);
    } catch (error) {
      const errEmbed = Utils.getErrorEmbed(
        error instanceof UserDisplayableError ? error.displayMessage : Constants.genericErrorMessage,
      );
      await (interaction.deferred || interaction.replied ? interaction.followUp : interaction.reply)({
        embeds: [errEmbed],
        ephemeral: true,
      }).catch((err) => Logger.error(Utils.processError(err)));
      throw error;
    }
  },
});

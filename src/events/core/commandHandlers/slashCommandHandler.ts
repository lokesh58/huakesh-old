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

export const slashCommandHandler = new ClientEvent({
  name: 'Slash Command Handler',
  type: 'interactionCreate',
  handler: async (interaction) => {
    if (!interaction.isCommand()) return;
    const { client, commandName, commandId } = interaction;
    try {
      const cmd = client.commands.get(commandName);
      if (!cmd) throw new UnknownCommandError(CommandTypes.SLASH_COMMAND, commandName, commandId);
      if (!cmd.isSlashCommand()) {
        throw new CommandTypeMismatchError(commandName, commandId, cmd.type, CommandTypes.SLASH_COMMAND);
      }
      cmd.checkPermissions(interaction);
      await cmd.handler(interaction);
    } catch (error) {
      const errEmbed = Utils.getErrorEmbed(
        error instanceof UserDisplayableError ? error.displayMessage : Constants.genericErrorMessage,
      );
      const errPayload = {
        embeds: [errEmbed],
        ephemeral: true,
      };
      try {
        if (interaction.deferred || interaction.replied) {
          await interaction.followUp(errPayload);
        } else {
          await interaction.reply(errPayload);
        }
      } catch (err) {
        Logger.error(Utils.processError(err));
      }
      throw error;
    }
  },
});

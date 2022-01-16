import { SlashCommandBuilder } from '@discordjs/builders';
import { AutocompleteInteraction, CacheType, CommandInteraction } from 'discord.js';
import { Command, CommandDetails } from './Command';
import { CommandTypes, InteractionHandler } from './types';

/**
 * Interface for slash command details
 */
export interface SlashCommandDetails<Cached extends CacheType = CacheType> extends CommandDetails {
  /**
   * The data for this slash command
   */
  readonly data: SlashCommandBuilder;

  /**
   * The autocomplete handler for this slash command
   */
  readonly autocompleteHandler?: InteractionHandler<AutocompleteInteraction<Cached>>;

  /**
   * The handler for this slash command
   */
  readonly handler: InteractionHandler<CommandInteraction<Cached>>;
}

/**
 * Class for slash commands
 */
export class SlashCommand<Cached extends CacheType = CacheType>
  extends Command<Cached>
  implements SlashCommandDetails<Cached>
{
  public readonly data: SlashCommandBuilder;
  public readonly type: CommandTypes.SLASH_COMMAND;
  public readonly autocompleteHandler?: InteractionHandler<AutocompleteInteraction<Cached>>;
  public readonly handler: InteractionHandler<CommandInteraction<Cached>>;

  /**
   * @param details The details for this slash command
   */
  constructor(details: SlashCommandDetails<Cached>) {
    super(details);
    const { data, autocompleteHandler, handler } = details;
    this.data = data;
    this.type = CommandTypes.SLASH_COMMAND;
    if (autocompleteHandler) this.autocompleteHandler = autocompleteHandler;
    this.handler = handler;
  }

  public isSlashCommand(): this is SlashCommand<Cached> {
    return true;
  }
}

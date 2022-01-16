import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { CacheType, ContextMenuInteraction } from 'discord.js';
import { Command, CommandDetails } from './Command';
import { CommandTypes, InteractionHandler } from './types';

/**
 * Interface for context menu command details
 */
export interface ContextMenuCommandDetails<Cached extends CacheType = CacheType> extends CommandDetails {
  /**
   * The data for this context menu command
   */
  readonly data: ContextMenuCommandBuilder;

  /**
   * The handler for this context menu command
   */
  readonly handler: InteractionHandler<ContextMenuInteraction<Cached>>;
}

/**
 * Class for context menu commands
 */
export class ContextMenuCommand<Cached extends CacheType = CacheType>
  extends Command<Cached>
  implements ContextMenuCommandDetails<Cached>
{
  public readonly data: ContextMenuCommandBuilder;
  public readonly type: CommandTypes.CONTEXT_MENU_COMMAND;
  public readonly handler: InteractionHandler<ContextMenuInteraction<Cached>>;

  /**
   * @param details The details for this context menu command
   */
  constructor(details: ContextMenuCommandDetails) {
    super(details);
    const { data, handler } = details;
    this.data = data;
    this.type = CommandTypes.CONTEXT_MENU_COMMAND;
    this.handler = handler;
  }

  public isContextMenuCommand(): this is ContextMenuCommand<Cached> {
    return true;
  }
}

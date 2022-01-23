import { CacheType, Interaction, PermissionResolvable } from 'discord.js';
import { PermissionError, PermissionTypes } from '../errors';
import { CommandTypes, InternalPermissions } from './constants';
import { ContextMenuCommand } from './ContextMenuCommand';
import { SlashCommand } from './SlashCommand';
import { CommandDataType, CommandInteractionHandlerType } from './types';

/**
 * Base interface for all command details
 */
export interface CommandDetails {
  /**
   * Whether this command can only be run by an application owner
   */
  readonly ownerOnly?: boolean;

  /**
   * Whether this command can only be run in a guild
   */
  readonly guildOnly?: boolean;

  /**
   * Permissions required by a user to use this command
   * **Note:** These are ignored outside of guild
   */
  readonly userPermissions?: PermissionResolvable;

  /**
   * Permissions required by the client to execute this command
   * **Note:** These are ignored outside of guild
   */
  readonly clientPermissions?: PermissionResolvable;
}

/**
 * Base class for all commands
 */
export abstract class Command<Cached extends CacheType = CacheType> implements CommandDetails {
  /**
   * The data of this command
   */
  public abstract readonly data: CommandDataType;

  /**
   * The handler of this command
   */
  public abstract readonly handler: CommandInteractionHandlerType<Cached>;

  /**
   * The type of this command
   */
  public abstract readonly type: CommandTypes;

  public readonly ownerOnly: boolean;
  public readonly guildOnly: boolean;
  public readonly userPermissions?: PermissionResolvable;
  public readonly clientPermissions?: PermissionResolvable;

  /**
   * @param details The details of this command
   */
  constructor(details: CommandDetails) {
    const { ownerOnly, guildOnly, userPermissions, clientPermissions } = details;
    this.ownerOnly = ownerOnly ?? false;
    this.guildOnly = guildOnly ?? false;
    if (userPermissions) this.userPermissions = userPermissions;
    if (clientPermissions) this.clientPermissions = clientPermissions;
  }

  /**
   * Returns true if permissions are satisfied, otherwise throws PermissionError.
   * **Note:** It also checks if command is guild only.
   * @param interaction The interaction for which to check permissions
   */
  public checkPermissions(interaction: Interaction): true {
    if (this.ownerOnly && !interaction.client.owners.has(interaction.user.id)) {
      throw new PermissionError(
        PermissionTypes.USER,
        InternalPermissions.OWNER_ONLY,
        interaction.user,
        interaction.guild,
      );
    }
    if (interaction.inCachedGuild()) {
      if (this.userPermissions) {
        const missingPerms = interaction.memberPermissions.missing(this.userPermissions);
        if (missingPerms.length) throw new PermissionError(PermissionTypes.USER, missingPerms, interaction.user);
      }
      if (this.clientPermissions) {
        // Adding non-null assertion here because not doing any custom caching, so bot's member will be always cached
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const missingPerms = interaction.guild.me!.permissions.missing(this.clientPermissions);
        if (missingPerms.length)
          throw new PermissionError(PermissionTypes.CLIENT, missingPerms, interaction.user, interaction.guild);
      }
    } else if (this.guildOnly) {
      throw new PermissionError(PermissionTypes.USER, InternalPermissions.GUILD_ONLY, interaction.user);
    }
    return true;
  }

  /**
   * Returns the data that should be sent to Discord for registering this command.
   * **Note:** Calling this function also validates the properties of this command.
   */
  public toJSON() {
    return this.data.toJSON();
  }

  /**
   * Checks whether this command is a slash command.
   */
  public isSlashCommand(): this is SlashCommand<Cached> {
    return false;
  }

  /**
   * Checks whether this command is a context menu command.
   */
  public isContextMenuCommand(): this is ContextMenuCommand<Cached> {
    return false;
  }
}

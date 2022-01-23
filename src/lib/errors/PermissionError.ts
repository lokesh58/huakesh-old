import { commaListsAnd, stripIndent } from 'common-tags';
import { Guild, PermissionString, User } from 'discord.js';
import { InternalPermissions } from '../commands';
import { LogLevels } from '../logs';
import { PermissionTypes } from './constants';
import { UserDisplayableError } from './UserDisplayableError';

export class PermissionError extends UserDisplayableError {
  public readonly data: {
    permissionType: PermissionTypes;
    missingPerms: PermissionString[] | InternalPermissions;
    user: User;
    guild?: Guild;
  };

  public readonly level: LogLevels;
  public readonly displayMessage: string;

  constructor(permissionType: PermissionTypes.CLIENT, missingPerms: PermissionString[], user: User, guild: Guild);
  constructor(
    permissionType: PermissionTypes.USER,
    missingPerms: PermissionString[] | InternalPermissions,
    user: User,
    guild?: Guild | null,
  );

  constructor(
    permissionType: PermissionTypes,
    missingPerms: PermissionString[] | InternalPermissions,
    user: User,
    guild?: Guild | null,
  ) {
    super(stripIndent`
      ${permissionType} missing permissions: ${missingPerms}
      User: ${user.tag} ${user.id}
      ${guild ? `Guild: ${guild.name} ${guild.id}` : 'Used in DMs'}
    `);
    this.data = { permissionType, missingPerms, user, ...(guild && { guild }) };
    this.level = LogLevels.WARN;
    this.displayMessage =
      permissionType === PermissionTypes.CLIENT
        ? this.getClientMissingPermsMessage()
        : this.getUserMissingPermsMessage();
  }

  private getClientMissingPermsMessage() {
    return commaListsAnd`I'm missing following permissions to run this command: ${this.data.missingPerms}.`;
  }

  private getUserMissingPermsMessage() {
    const { missingPerms } = this.data;
    if (missingPerms === InternalPermissions.OWNER_ONLY) {
      return "Only the bot's owner can use this command.";
    } else if (missingPerms === InternalPermissions.GUILD_ONLY) {
      return 'You can only use this command in a server.';
    } else {
      return commaListsAnd`You are missing following permissions to run this command: ${missingPerms}.`;
    }
  }
}

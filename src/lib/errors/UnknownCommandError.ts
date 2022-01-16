import { Snowflake } from 'discord.js';
import { CommandTypes } from '../commands';
import { LogLevels } from '../logs';
import { HuakeshError } from './HuakeshError';

/**
 * Error class for unknown commands being received.
 */
export class UnknownCommandError extends HuakeshError {
  public readonly data: { commandName: string; commandType: CommandTypes; commandId: Snowflake };
  public readonly level: LogLevels;

  /**
   * @param commandType The type of command
   * @param commandName The name of command
   * @param commandId The id of command
   */
  constructor(commandType: CommandTypes, commandName: string, commandId: Snowflake) {
    super(`Unknown ${commandType} recieved ${commandName} with id ${commandId}`);
    this.data = { commandName, commandType, commandId };
    this.level = LogLevels.ERROR;
  }
}

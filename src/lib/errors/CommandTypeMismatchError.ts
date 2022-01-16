import { Snowflake } from 'discord.js';
import { CommandTypes } from '../commands';
import { LogLevels } from '../logs';
import { HuakeshError } from './HuakeshError';

/**
 * Error class for command type mismatches.
 */
export class CommandTypeMismatchError extends HuakeshError {
  public readonly data: {
    commandName: string;
    commandId: Snowflake;
    expectedType: CommandTypes;
    receivedType: CommandTypes;
  };

  public readonly level: LogLevels;

  /**
   * @param commandName The name of command
   * @param commandId The id of command
   * @param expectedType The expected command type
   * @param receivedType The recieved command type
   */
  constructor(commandName: string, commandId: Snowflake, expectedType: CommandTypes, receivedType: CommandTypes) {
    super(`Expected ${expectedType} but recieved ${receivedType} for command ${commandName} with id ${commandId}`);
    this.data = { commandName, commandId, expectedType, receivedType };
    this.level = LogLevels.ERROR;
  }
}

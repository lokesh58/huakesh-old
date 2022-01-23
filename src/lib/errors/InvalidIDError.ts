import { Snowflake } from 'discord.js';
import { LogLevels } from '../logs';
import { Structures } from './constants';
import { HuakeshError } from './HuakeshError';

/**
 * Error class for invalid id for structures.
 */
export class InvalidIDError extends HuakeshError {
  public readonly data: { structure: Structures; id: Snowflake };
  public readonly level: LogLevels;

  /**
   * @param structure The type of structure
   * @param id The invalid id
   */
  constructor(structure: Structures, id: Snowflake) {
    super(`Invalid ID ${id} for ${structure}`);
    this.data = { structure, id };
    this.level = LogLevels.ERROR;
  }
}

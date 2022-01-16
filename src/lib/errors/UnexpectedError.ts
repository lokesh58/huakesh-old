import { inspect } from 'util';
import { LogLevels } from '../logs';
import { HuakeshError } from './HuakeshError';

/**
 * Error class for all unexpected errors.
 * This class is used to handle errors from other modules.
 */
export class UnexpectedError extends HuakeshError {
  public readonly data: { error: unknown };
  public readonly level: LogLevels;

  /**
   * @param error The unexpected error encountered
   */
  constructor(error: unknown) {
    super(error instanceof Error ? `${error.name}: ${error.message}` : inspect(error));
    this.data = { error };
    this.level = LogLevels.ERROR;
  }
}

import { LogLevels } from '../logs';

/**
 * The base class for any bot errors.
 */
export abstract class HuakeshError extends Error {
  /**
   * The data related to this error
   */
  public abstract readonly data: Record<string, unknown>;

  /**
   * The logging level of this error
   */
  public abstract readonly level: LogLevels;

  /**
   * @param message The error message
   */
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

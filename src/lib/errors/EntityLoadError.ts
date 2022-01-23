import { LogLevels } from '../logs';
import { Entities } from '../types';
import { LoadErrors } from './constants';
import { HuakeshError } from './HuakeshError';

/**
 * Error class for all entity loading errors.
 */
export class EntityLoadError extends HuakeshError {
  public readonly data: { entity: Entities; entityName: string; error: LoadErrors };
  public readonly level: LogLevels;

  private static readonly loadErrorMessages: Record<LoadErrors, string> = {
    [LoadErrors.DUPLICATE]: 'Entity names must be unique.',
  };

  /**
   * @param entity The entity for which loading failed
   * @param entityName The name of the entity
   * @param error The error due to which loading failed
   */
  constructor(entity: Entities, entityName: string, error: LoadErrors) {
    super(`${error} ${entity} ${entityName}: ${EntityLoadError.loadErrorMessages[error]}`);
    this.data = { entity, entityName, error };
    this.level = LogLevels.ERROR;
  }
}

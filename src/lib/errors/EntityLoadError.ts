import { LogLevels } from '../logs';
import { Entities } from '../types';
import { loadErrorMessages } from './constants';
import { HuakeshError } from './HuakeshError';
import { LoadErrors } from './types';

/**
 * Error class for all entity loading errors.
 */
export class EntityLoadError extends HuakeshError {
  public readonly data: { entity: Entities; entityName: string; error: LoadErrors };
  public readonly level: LogLevels;

  /**
   * @param entity The entity for which loading failed
   * @param entityName The name of the entity
   * @param error The error due to which loading failed
   */
  constructor(entity: Entities, entityName: string, error: LoadErrors) {
    super(`${error} ${entity} ${entityName}: ${loadErrorMessages[error]}`);
    this.data = { entity, entityName, error };
    this.level = LogLevels.ERROR;
  }
}

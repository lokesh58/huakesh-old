import { LogLevels } from '../logs';
import { Entities } from '../types';
import { HuakeshError } from './HuakeshError';

/**
 * Error class when something is not implemented on an enitity.
 */
export class NotImplementedError extends HuakeshError {
  public readonly data: { entity: Entities; entityName: string; method: string };
  public readonly level: LogLevels;

  /**
   * @param entity The entity on which the method is not implemented
   * @param entityName The name of the entity
   * @param method The name of method that is not implemented
   */
  constructor(entity: Entities, entityName: string, method: string) {
    super(`${entity} ${entityName}: ${method} not implemented`);
    this.data = { entity, entityName, method };
    this.level = LogLevels.ERROR;
  }
}

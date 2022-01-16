import { HuakeshError } from './HuakeshError';

export abstract class UserDisplayableError extends HuakeshError {
  public abstract readonly displayMessage: string;
}

import { LoadErrors } from './types';

/**
 * A mapping from loading errors to corresponding error messages.
 */
export const loadErrorMessages: Record<LoadErrors, string> = {
  [LoadErrors.DUPLICATE]: 'Entity names must be unique.',
};

/**
 * Enum of logging levels.
 */
export enum LogLevels {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * A mapping from level of log to the console style to be used.
 */
export const logLevelToConsoleStyle: Record<LogLevels, string> = {
  [LogLevels.INFO]: '\x1b[40m\x1b[37m',
  [LogLevels.WARN]: '\x1b[40m\x1b[93m',
  [LogLevels.ERROR]: '\x1b[40m\x1b[31m',
};

/**
 * The default console style.
 */
export const resetConsoleStyle = '\x1b[0m';

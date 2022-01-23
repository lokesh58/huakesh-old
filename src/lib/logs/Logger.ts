/* eslint-disable @typescript-eslint/no-explicit-any */

import { LogLevels, logLevelToConsoleStyle, resetConsoleStyle } from './constants';

/**
 * Logger class for help with logging.
 * Three levels are supported:
 * - info
 * - warn
 * - error
 */
export abstract class Logger {
  /**
   * Public method to do the actual logging.
   * @param level The level of log
   * @param message The message to log
   * @param args Any additional arguments for logging
   */
  public static log(level: LogLevels, message: any, ...args: any[]) {
    const color = logLevelToConsoleStyle[level];
    const time = `${color}[${new Date().toISOString()}]${resetConsoleStyle}`;
    if (typeof message === 'string') {
      console.log(`${time} ${message}`, ...args);
    } else {
      console.log(time, message, ...args);
    }
  }

  /**
   * Logging level: info
   * @param message The message to log
   * @param args Any additional arguments for logging
   */
  public static info(message: any, ...args: any[]) {
    Logger.log(LogLevels.INFO, message, ...args);
  }

  /**
   * Logging level: warn
   * @param message The message to log
   * @param args Any additional arguments for logging
   */
  public static warn(message: any, ...args: any[]) {
    Logger.log(LogLevels.WARN, message, ...args);
  }

  /**
   * Logging level: error
   * @param message The message to log
   * @param args Any additional arguments for logging
   */
  public static error(message: any, ...args: any[]) {
    Logger.log(LogLevels.ERROR, message, ...args);
  }
}

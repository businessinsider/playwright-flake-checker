import fs from 'fs';
import { spawn } from 'child_process';
import { getConfig } from '../config/config.js';
import { log } from './logger.js';
import { isDetachedServerRunning } from '../services/server.js';

/**
 * Returns a promise that resolves after the specified number of milliseconds.
 * @param ms - The number of milliseconds to sleep.
 * @returns {Promise<void>} A promise that resolves after the specified time.
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

/**
 * Finds and parses the package.json file from the current directory.
 *
 * @returns {PackageJson} The parsed package.json object. If the file cannot be found or parsed,
 * returns a default object with name set to 'Unknown Project' and empty scripts.
 */
export const findPackageJson = (): PackageJson => {
  let packageJson: PackageJson;

  try {
    packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  } catch {
    log().yellow('Warning: package.json not found. Project name and scripts will be unavailable.');
    packageJson = { name: 'Unknown Project', scripts: {} };
  }

  return packageJson;
};

/**
 * Gracefully exits the script, stopping any detached server if running.
 *
 * - If a detached server is running, it attempts to kill the port specified in the configuration.
 * - If no detached server is running, it simply exits the script.
 */
export const gracefulExit = () => {
  const CONFIG = getConfig();
  const detachedServer = isDetachedServerRunning();

  if (detachedServer && CONFIG.ports) {
    log().red('\nStopping detached server and exiting script...');

    spawn('npx', ['kill-port', CONFIG.ports], {
      stdio: 'ignore',
      detached: true
    }).unref();
  } else {
    log().red('\nExiting script...');
  }

  process.exit(1);
};

/**
 * Handles errors by logging them and gracefully exiting the script.
 * - If the error is an ExitPromptError, it logs a cancellation message.
 * - If the error message indicates a prompt was closed, it logs a cancellation message.
 * - If the error message indicates a command was interrupted by the user, it exits gracefully.
 * - For all other errors, it logs the error message and stack trace, then exits gracefully.
 *
 * @param {Error} error - The error to handle.
 * @returns {void}
 */
export const handleError = (error: Error): void => {
  if (error.name === 'ExitPromptError') {
    log().yellow('\nOperation cancelled by user (prompt).');

    gracefulExit();
  } else if (error.message && error.message.toLowerCase().includes('prompt closed')) {
    log().yellow('\nUser cancelled the script.');

    gracefulExit();
  } else if (error.message === 'Command interrupted by user.') {

    gracefulExit();
  } else {
    log().red('\nAn unexpected error occurred:');
    console.error(error.message);

    if (error.stack) console.error(error.stack);

    gracefulExit();
  }
};

/**
 * Retrieves all script entries from package.json and formats them as name-value pairs.
 * @returns An array of objects with name and value properties, both containing the script name.
 * Returns an empty array if no scripts are found.
 */
export const projectScripts = (): { name: string; value: string }[] => {
  const { scripts } = findPackageJson();

  if (!scripts) return [];

  return Object.entries(scripts).map(([name]) => ({
    name,
    value: name
  }));
};

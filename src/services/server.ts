import { spawn } from 'child_process';
import { confirm, input } from '@inquirer/prompts';
import { select } from 'inquirer-select-pro';
import { projectScripts, sleep } from '../utils/common.js';
import { getConfig } from '../config/config.js';
import { log, styled} from '../utils/logger.js';
import { runCommand } from '../utils/command.js';

const { command: commandStyling, emphasis, url } = styled;

/**
 * Tracks whether the server was started in detached mode.
 */
let detachedServer = false;

/**
 * Checks if the server is running and prompts the user to start it if not.
 * @param url - The URL of the server to check.
 * @param timeoutMs - The maximum time to wait for the server to respond, in milliseconds.
 * @returns {Promise<boolean>} - Returns true if the server is running or started successfully, false otherwise.
 */
export const checkServerStatus = async (
  route: string,
  timeoutMs = 10000
): Promise<boolean> => {
  const endTime = Date.now() + timeoutMs;
  const POLL_INTERVAL_MS = 1000;

  const isServerUp = async () => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), POLL_INTERVAL_MS - 100);
      const response = await fetch(route, { signal: controller.signal });

      clearTimeout(id);

      return response.ok;
    } catch (error) {
      return false;
    }
  };

  async function poll() {
    if (Date.now() >= endTime) {
      log().warning(`${url(route)} did not respond within ${timeoutMs / 1000}s.\n`);

      return false;
    }
    if (await isServerUp()) {
      log().green(`Server at ${url(route)} is up!`);

      return true;
    }
    await sleep(POLL_INTERVAL_MS);

    return poll();
  }

  log().info(`\nChecking server status at ${url(route)}...\n`);

  return poll();
}

/**
 * Determines if the server is running in detached mode.
 *
 * @returns {boolean} True if a detached server was started, otherwise false.
 */
export const isDetachedServerRunning = (): boolean => detachedServer;

/**
 * Sets the state of the detached server.
 * @param state - State of the detached server.
 * @returns {void}
 */
export const setDetachedServerState = (state: boolean): void => {
  detachedServer = state
};

/**
 * Starts or builds a server process using either custom commands or npm scripts.
 *
 * This function provides an interactive CLI to select how to start or build a server:
 * - Using npm scripts from package.json
 * - Using a custom command provided by the user
 *
 * The server can run in foreground or detached (background) mode.
 *
 * @param {boolean} detached - When true, runs the server process detached in the background.
 *                             When false (default), runs server in foreground.
 * @param {object} options - Configuration options for the server
 * @param {boolean} options.buildOnly - When true, only builds the server without starting it
 * @param {('custom'|'scripts'|undefined)} options.mode - Controls how server commands are collected:
 *   - `'custom'` - Skip script selection and request custom command
 *   - `'scripts'` - Force using package.json scripts
 *   - `undefined` - Ask user to choose between scripts or custom command
 * @returns {Promise<boolean>} A Promise resolving to true if server was started/built successfully, false otherwise
 */
export const startServer = async (
  detached = false,
  options: ServerOptions = {}
): Promise<boolean> => {
  detachedServer = detached;
  const allCommands: string[] = [];
  const { buildOnly, mode } = options;

  let useProjectScripts = true;
  if (mode === 'custom') {
    useProjectScripts = false;
  } else if (mode === 'scripts') {
    useProjectScripts = true;
  } else {
    useProjectScripts = await confirm({
      message: `Do you want to ${buildOnly ? 'build' : 'start'} it using a script(s) from your ${emphasis('package.json')}?`,
      default: true
    });
  }

  if (!useProjectScripts) {
    const customCmd = await input({
      message: 'Please enter the custom server command to run:',
      required: true
    });

    allCommands.push(customCmd);

    const command = allCommands.join(' && ');
    if (!(await confirm({ message: `Run server command: ${commandStyling(command)}?`, default: true }))) {
      log().yellow('Custom command cancelled. Returning to custom command input.');

      return startServer(detached, { mode: 'custom' });
    }
  } else {
    const selectedScripts = await select({
      confirmDelete: true,
      message: `Select scripts to ${buildOnly ? 'build' : 'run'} your server:`,
      options: async text => {
        const scripts = projectScripts();
        if (!text) return scripts;

        return scripts.filter((script: { name: string; }) =>
          script.name.toLowerCase().includes(text.toLowerCase())
        );
      },
      multiple: true,
    });

    if (!selectedScripts || selectedScripts.length === 0) {
      log().yellow('No server scripts selected.');

      if (!(
        await confirm({
          message: `Continue without ${buildOnly ? 'building the server?' : 'starting a server script?'}`,
          default: false
        })
      )) {
        return startServer(detached);
      }

      return false;
    }

    selectedScripts.forEach(script => allCommands.push(`npm run ${script}`));

    const command = allCommands.join(' && ');
    if (!(await confirm({ message: `Run server command(s): ${commandStyling(command)}?`, default: true }))) {
      log().yellow('Server start cancelled by user.');

      return startServer(detached, { mode: 'scripts' });
    }
  }

  if (allCommands.length === 0) {
    log().yellow('No server commands to run.');

    return false;
  }

  const command = allCommands.join(' && ');
  log().info(`\n${buildOnly ? 'Building' : 'Starting'} server with command: ${commandStyling(command)}`);

  if (detachedServer) {
    const child = spawn(command, [], {
      detached: true, stdio: 'ignore', env: process.env, shell: true
    });

    child.unref();

    return true;
  }

  try {
    await runCommand(command, [], {}, buildOnly, false);

    if (buildOnly) log().green('\nServer built successfully.\n');

    return true;
  } catch (error: unknown) {
    if (error instanceof Error && error.message !== 'Command interrupted by user.') {
      log().error('Failed to start server in foreground:', error.message);

      if (await confirm({ message: 'Would you like to try a different command?', default: true })) {
        return startServer(detached, { mode: useProjectScripts ? 'scripts' : 'custom' });
      }
    } else {
      log().error('Failed to start server in foreground with an unknown error');
    }

    return false;
  }
}

/**
 * Handles the server prompt logic based on whether the server is already running.
 * @param isServerRunning - Indicates if the server is already running.
 * @returns {Promise<boolean>} - Returns true if the server is running or started successfully, false otherwise.
 */
export const handleServerPrompt = async (isServerRunning: boolean): Promise<boolean> => {
  const CONFIG = getConfig();

  if (!isServerRunning) {
    const buildOnly = await confirm({
      message: 'Do you want to build the project without starting the server?',
      default: false
    });

    if (buildOnly) {
      await startServer(false, { buildOnly: true });
    } else {
      const manuallyStartServer = await confirm({
        message: 'The server doesn\'t appear to be running. Do you want to start it?',
        default: true
      });

      if (manuallyStartServer) {
        if (await startServer(true)) {
          log().info('\nAttempting to start server. Waiting a few seconds for it to initialize...\n');

          await sleep(5000);

          if (CONFIG.baseUrl && !(await checkServerStatus(CONFIG.baseUrl, 30000))) {
            log().warning(`${url(CONFIG.baseUrl)} is still not responsive after auto-start. Check server logs.`);
          } else if (CONFIG.baseUrl) {
            log().green(`Server at ${url(CONFIG.baseUrl)} seems to be running now.\n`);
          }

          return true;
        }

        log().error('Server could not be started by the script.\n');
      }

      log().warning('Please ensure your server is running or Playwright is configured to start it.\n');

      return confirm({ message: 'Do you want to continue with the tests anyway?', default: false });
    }
  }

  return true;
}

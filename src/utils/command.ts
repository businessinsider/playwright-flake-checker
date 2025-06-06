import { log } from './logger.js';
import { ChildProcess, spawn } from 'child_process';

/**
 * Cleans up event listeners from both the process and child object.
 *
 * @param proc - The Node.js process object from which to remove listeners
 * @param child - An object with removeListener method, typically a child process
 * @param handlers - Object containing event handler references
 * @param handlers.error - Error event handler to be removed
 * @param handlers.exit - Exit/close event handler to be removed
 * @param handlers.ctrlC - SIGINT event handler to be removed
 * @returns {void}
 */
export const cleanup = (
  proc: NodeJS.Process,
  child: ChildProcess,
  handlers: {
    error: (_error: Error) => void;
    exit: (_code: number | null, _signal: string | null) => void;
    ctrlC: () => void;
  }
): void => {
  proc.removeListener('SIGINT', handlers.ctrlC);
  child.removeListener('exit', handlers.exit);
  child.removeListener('close', handlers.exit);
  child.removeListener('error', handlers.error);
};

/**
 * Creates a command executor function that runs shell commands as child processes
 *
 * @returns A function that executes commands and returns their results
 *   - `command` The command to execute
 *   - `args` Optional array of command arguments
 *   - `env` Optional environment variables to add to the process environment
 *   - `silent` If true, suppresses command output to stdout/stderr
 *   - `captureOutput` If true, captures and returns command output
 */
export const createCommandExecutor = (): (
  _command: string,
  _args?: string[],
  _env?: Record<string, string>,
  _silent?: boolean,
  _captureOutput?: boolean
) => Promise<CommandResult> => {
  return (
    command: string,
    args = [],
    env = {},
    silent = false,
    captureOutput = false
  ) => new Promise((resolve, reject) => {
    const fullCommand = command + (args.length > 0 ? ` ${args.join(' ')}` : '');

    let stdioOption: 'inherit' | 'ignore' | 'pipe';
    if (silent && !captureOutput) {
      stdioOption = 'ignore';
    } else if (captureOutput) {
      stdioOption = 'pipe';
    } else {
      stdioOption = 'inherit';
    }

    const child = spawn(command, args, {
      stdio: stdioOption,
      env: { ...process.env, ...env },
      shell: true,
    });

    let stdoutData = '';
    let stderrData = '';

    if (captureOutput) {
      child.stdout?.on('data', (data: string | Uint8Array<ArrayBufferLike>) => {
        stdoutData += data.toString();
        if (!silent) process.stdout.write(data);
      });
      child.stderr?.on('data', (data: string | Uint8Array<ArrayBufferLike>) => {
        stderrData += data.toString();
        if (!silent) process.stderr.write(data);
      });
    }

    const handlers = {
      error: (err: Error) => {
        cleanup(process, child, handlers);
        log().red(`Error executing command: ${fullCommand}`);

        reject(err);
      },
      exit: (code: number | null, signal: string | null) => {
        cleanup(process, child, handlers);

        const output = stdoutData + stderrData;
        if (signal === 'SIGINT' || code === 130) {
          log().yellow('Command interrupted by user.');

          reject(new Error('Command interrupted by user.'));
        } else if (code !== 0) {
          log().red(`Command failed: ${fullCommand} (exit code ${code}, signal ${signal})`);

          resolve({
            code: code ?? 0,
            signal: signal ?? '',
            output,
            success: false
          });
        } else {
          resolve({
            code: code ?? 0,
            signal: signal ?? '',
            output,
            success: true
          });
        }
      },
      ctrlC: () => {
        log().yellow('\nCtrl+C pressed. Terminating child process...');
        child.kill('SIGINT');
      }
    };

    process.once('SIGINT', handlers.ctrlC);
    child.once('exit', handlers.exit);
    child.once('error', handlers.error);
  });
};

/**
 * Executes commands using the command executor created by `createCommandExecutor`.
 * This function likely runs shell commands or similar operations.
 *
 * @returns The result of the executed command, type determined by the underlying executor
 *
 * @see `createCommandExecutor` For information about the underlying implementation
 */
export const runCommand = createCommandExecutor();

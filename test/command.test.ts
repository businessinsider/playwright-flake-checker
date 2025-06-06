/* eslint-disable playwright/no-standalone-expect */
import { describe, it, expect, vi } from 'vitest';
import { cleanup, createCommandExecutor } from '../src/utils/command.js';
import { ChildProcess } from 'child_process';

describe('command utils', () => {
  it('cleanup removes listeners', () => {
    const proc = { removeListener: vi.fn() } as unknown as NodeJS.Process;
    const child = { removeListener: vi.fn() } as unknown as ChildProcess;
    const handlers = { error: vi.fn(), exit: vi.fn(), ctrlC: vi.fn() };
    cleanup(proc, child, handlers);
    expect(proc.removeListener).toHaveBeenCalledWith('SIGINT', handlers.ctrlC);
    expect(child.removeListener).toHaveBeenCalled();
  });

  it('createCommandExecutor returns function', () => {
    const exec = createCommandExecutor();
    expect(typeof exec).toBe('function');
  });
});
import { runCommand } from '../src/utils/command.js';
vi.mock('child_process', () => ({ spawn: vi.fn(() => ({
  stdout: { on: vi.fn() },
  stderr: { on: vi.fn() },
  once: vi.fn(),
  removeListener: vi.fn()
})) }));

describe('runCommand', () => {
  it('executes command', async () => {
    await expect(runCommand('echo')).resolves.toBeDefined();
  });
});

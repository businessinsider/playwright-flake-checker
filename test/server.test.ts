/* eslint-disable playwright/no-standalone-expect */
import { describe, it, expect, vi } from 'vitest';
import * as server from '../src/services/server.js';
import * as command from '../src/utils/command.js';
import * as common from '../src/utils/common.js';

vi.mock('../src/utils/command.js');
vi.mock('../src/utils/common.js');
vi.mock('@inquirer/prompts', async () => ({
  confirm: vi.fn(() => true),
  input: vi.fn(() => 'npm run start')
}));
vi.mock('inquirer-select-pro', async () => ({ select: vi.fn(() => ['start']) }));

const { checkServerStatus, isDetachedServerRunning, setDetachedServerState, startServer, handleServerPrompt } = server;

describe('server utilities', () => {
  it('should set and get detached server state', () => {
    setDetachedServerState(true);
    expect(isDetachedServerRunning()).toBe(true);
  });

  it('checkServerStatus returns false when fetch fails', async () => {
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('fail')));
    const result = await checkServerStatus('http://localhost');
    expect(result).toBe(false);
  });

  it('startServer returns true on success', async () => {
    (command.runCommand as unknown as vi.Mock).mockResolvedValue({ success: true });
    const result = await startServer(false, { mode: 'scripts' });
    expect(result).toBe(true);
  });

  it('handleServerPrompt returns true if server running', async () => {
    (common.sleep as unknown as vi.Mock).mockResolvedValue(undefined);
    const res = await handleServerPrompt(true);
    expect(res).toBe(true);
  });
});

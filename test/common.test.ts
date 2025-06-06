/* eslint-disable playwright/no-standalone-expect */
import { describe, it, expect, vi } from 'vitest';
import * as common from '../src/utils/common.js';

vi.mock('../src/utils/logger.js', () => ({ log: () => ({ yellow: vi.fn(), red: vi.fn() }) }));
vi.mock('../src/config/config.js', () => ({ getConfig: () => ({ ports: '3000' }) }));
vi.mock('../src/services/server.js', () => ({ isDetachedServerRunning: () => true }));
vi.mock('child_process', () => ({ spawn: vi.fn(() => ({ unref: vi.fn() })) }));

const { sleep, findPackageJson, gracefulExit, handleError, projectScripts } = common;

describe('common utils', () => {
  it('sleep resolves after ms', async () => {
    const t = Date.now();
    await sleep(10);
    expect(Date.now() - t).toBeGreaterThanOrEqual(10);
  });

  it('findPackageJson returns object', () => {
    vi.spyOn(common as unknown as { log: () => void }, 'log');
    expect(findPackageJson()).toHaveProperty('scripts');
  });

  it('gracefulExit calls process.exit', () => {
    const spy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    try { gracefulExit(); } catch { /* ignore */ }
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('handleError handles exit prompt', () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    const err = new Error('prompt closed');
    handleError(err);
    expect(exitSpy).toHaveBeenCalled();
    exitSpy.mockRestore();
  });

  it('projectScripts returns array', () => {
    vi.spyOn(common, 'findPackageJson').mockReturnValue({ scripts: { start: 'a' }, name: 'n' });
    const scripts = projectScripts();
    expect(scripts.length).toBe(1);
  });
});

/* eslint-disable playwright/no-standalone-expect */
import { describe, it, expect, vi } from 'vitest';
import * as tests from '../src/services/tests.js';
import * as command from '../src/utils/command.js';

vi.mock('../src/utils/command.js');
vi.mock('@inquirer/prompts', async () => ({ confirm: vi.fn(() => true) }));
vi.mock('inquirer-select-pro', async () => ({ select: vi.fn(() => [{ name: 'a', value: 'a' }]) }));
vi.mock('chalk', async () => ({ default: { italic: (s: string) => s } }));
vi.mock('path', async () => ({ basename: (p: string) => p }));

const { runPlaywrightTests, checkForIsolatedTests, getAndSelectPlaywrightTests } = tests;

describe('tests services', () => {
  it('runPlaywrightTests returns success result', async () => {
    (command.runCommand as unknown as vi.Mock).mockResolvedValue({ success: true, output: 'ok' });
    const res = await runPlaywrightTests(['a'], 'cfg', 1);
    expect(res.success).toBe(true);
  });

  it('checkForIsolatedTests true when no violations', async () => {
    const eslint = { lintFiles: vi.fn().mockResolvedValue([]) } as unknown as { lintFiles: () => Promise<unknown[]> };
    vi.mock('eslint', () => ({ ESLint: vi.fn(() => eslint), getErrorResults: () => [] }));
    const result = await checkForIsolatedTests(['a']);
    expect(result).toBe(true);
  });

  it('getAndSelectPlaywrightTests returns list', async () => {
    (command.runCommand as unknown as vi.Mock).mockResolvedValue({ success: true, output: 'a.spec.ts' });
    const res = await getAndSelectPlaywrightTests('cfg');
    expect(res).toEqual([{ name: 'a', value: 'a' }]);
  });
});

/* eslint-disable playwright/no-standalone-expect */
import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import * as configModule from '../src/config/config.js';

// use jest-style mocking
vi.mock('fs');
vi.mock('@inquirer/prompts', async () => ({
  input: vi.fn(() => 'config.json'),
  select: vi.fn(() => 'config.json')
}));

const { getConfig, updateConfig, getCustomConfig, findConfigFiles } = configModule;

describe('config utilities', () => {
  it('should update and get config', () => {
    updateConfig({ baseUrl: 'http://test' });
    expect(getConfig().baseUrl).toBe('http://test');
  });

  it('getCustomConfig should resolve existing file', async () => {
    (fs.existsSync as unknown as vi.Mock).mockReturnValue(true);
    const result = await getCustomConfig();
    expect(result).toBe('config.json');
  });

  it('findConfigFiles should return selected file', async () => {
    (fs.readdirSync as unknown as vi.Mock).mockReturnValue([{ isFile: () => true, name: 'playwright.config.ts' }]);
    (fs.readFileSync as unknown as vi.Mock).mockReturnValue('@playwright/test');
    const result = await findConfigFiles();
    expect(result).toBe('config.json');
  });
});

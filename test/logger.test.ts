/* eslint-disable playwright/no-standalone-expect */
import { describe, it, expect, vi } from 'vitest';
import { log, styled } from '../src/utils/logger.js';

vi.mock('figlet', () => ({ default: { textSync: vi.fn(() => 'banner') } }));

import { displayBanner } from '../src/utils/logger.js';

describe('logger utilities', () => {
  it('log returns logger methods', () => {
    const logger = log();
    expect(typeof logger.info).toBe('function');
  });

  it('styled provides highlight', () => {
    expect(typeof styled.highlight).toBe('function');
  });

  it('displayBanner prints banner', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    displayBanner();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

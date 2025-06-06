/* eslint-disable playwright/no-standalone-expect */
import { describe, it, expect } from 'vitest';
import { flakeChecker } from '../src/flake-checker.js';

describe('flake checker', () => {
  it('exports a function', () => {
    expect(typeof flakeChecker).toBe('function');
  });
});

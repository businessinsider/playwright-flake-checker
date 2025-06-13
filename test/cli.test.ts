import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import * as flakeCheckerModule from '../src/flake-checker.js';
import * as commonModule from '../src/utils/common.js';

describe('CLI module', () => {
  test('CLI imports expected modules', () => {
    assert.equal(typeof flakeCheckerModule.flakeChecker, 'function');
    assert.equal(typeof commonModule.handleError, 'function');
  });

  test('CLI should handle errors in production environment', () => {
    const handleError = commonModule.handleError;

    assert.equal(typeof handleError, 'function');
  });
});

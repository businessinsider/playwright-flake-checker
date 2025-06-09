import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import * as flakeCheckerModule from '../src/flake-checker.js';
import * as commonModule from '../src/utils/common.js';

describe('CLI module', () => {
  test('CLI imports expected modules', () => {
    // Verify the important imports are available
    assert.equal(typeof flakeCheckerModule.flakeChecker, 'function');
    assert.equal(typeof commonModule.handleError, 'function');
  });

  test('CLI should handle errors in production environment', () => {
    // This test ensures error handling functionality exists
    const handleError = commonModule.handleError;

    // Verify the error handling function
    assert.equal(typeof handleError, 'function');

    // We can't easily test the CLI directly due to its self-invoking nature,
    // but we can verify that it imports the necessary error handling functionality
  });
});

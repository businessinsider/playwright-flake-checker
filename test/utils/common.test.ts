import { describe, test, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { sleep, findPackageJson, handleError } from '../../src/utils/common.js';

describe('common utility module', () => {
  describe('sleep function', () => {
    test('returns a promise that resolves after the specified time', async () => {
      const startTime = Date.now();
      await sleep(50);
      const elapsed = Date.now() - startTime;

      // Allow for some margin of error in the timing
      assert.ok(elapsed >= 45, `Expected to sleep for at least 45ms, but slept for ${elapsed}ms`);
    });
  });

  describe('findPackageJson function', () => {
    let mockFs;

    beforeEach(() => {
      mockFs = mock.method(fs, 'readFileSync', () => {
        return JSON.stringify({
          name: 'test-project',
          scripts: { test: 'node test' },
          version: '1.0.0'
        });
      });
    });

    afterEach(() => {
      mockFs.mock.restore();
    });

    test('parses package.json file if it exists', () => {
      const packageJson = findPackageJson();

      assert.deepEqual(packageJson, {
        name: 'test-project',
        scripts: { test: 'node test' },
        version: '1.0.0'
      });

      // Verify fs.readFileSync was called with the right path
      assert.equal(mockFs.mock.calls.length, 1);
      assert.equal(mockFs.mock.calls[0].arguments[0], 'package.json');
    });

    test('returns default object if package.json does not exist', () => {
      // Override the mock to throw error
      mockFs.mock.restore();
      mockFs = mock.method(fs, 'readFileSync', () => {
        throw new Error('File not found');
      });

      const packageJson = findPackageJson();
      assert.deepEqual(packageJson, {
        name: 'Unknown Project',
        scripts: {}
      });
    });

    test('returns default object if package.json cannot be parsed', () => {
      // Override the mock to return invalid JSON
      mockFs.mock.restore();
      mockFs = mock.method(fs, 'readFileSync', () => {
        return '{invalid: json}';
      });

      const packageJson = findPackageJson();
      assert.deepEqual(packageJson, {
        name: 'Unknown Project',
        scripts: {}
      });
    });
  });

  describe('handleError function', () => {
    test('handleError is a function', () => {
      assert.equal(typeof handleError, 'function');
    });
  });
});

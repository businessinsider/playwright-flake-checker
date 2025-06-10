import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { checkForIsolatedTests } from '../../src/services/tests.js';

describe('tests service', () => {
  describe('checkForIsolatedTests', () => {
    test('is a function that can be called', () => {
      assert.equal(typeof checkForIsolatedTests, 'function');
    });

    test('handles empty specs array gracefully', async () => {
      const result = await checkForIsolatedTests([]);

      assert.equal(result, true);
    });
  });
});

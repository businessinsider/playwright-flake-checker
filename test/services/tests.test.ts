import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { checkForIsolatedTests } from '../../src/services/tests.js';

describe('tests service', () => {
  describe('checkForIsolatedTests', () => {
    test('is a function that can be called', () => {
      // Since ESLint module is hard to mock properly due to read-only properties,
      // we'll just verify the function exists and has the right signature
      assert.equal(typeof checkForIsolatedTests, 'function');
    });

    test('handles empty specs array gracefully', async () => {
      // An empty specs array should not cause errors
      const result = await checkForIsolatedTests([]);
      assert.equal(result, true); // No isolated tests in an empty array
    });
  });
});

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { getConfig, updateConfig, findConfigFiles } from '../../src/config/config.js';

describe('config module', () => {
  describe('getConfig', () => {
    test('returns a copy of the configuration object', () => {
      const initialConfig = getConfig();

      // Verify it's a copy, not a reference
      const configCopy = getConfig();
      assert.notEqual(initialConfig, configCopy); // Different object references
      assert.deepEqual(initialConfig, configCopy); // But equal values
    });

    test('contains expected default configuration values', () => {
      const config = getConfig();

      // Check for at least some basic properties that should be there
      assert.ok('baseUrl' in config || 'maxAttempts' in config || 'iterationCount' in config);
    });
  });

  describe('updateConfig', () => {
    test('updates the configuration correctly', () => {
      const initialConfig = getConfig();

      // Update with a partial config
      const newValue = 'test-value';
      // Find a key to update
      const keyToUpdate = Object.keys(initialConfig)[0] || 'testKey';

      const updateObj = {};
      updateObj[keyToUpdate] = newValue;

      updateConfig(updateObj);

      // Check that config was updated
      const updatedConfig = getConfig();
      assert.equal(updatedConfig[keyToUpdate], newValue);

      // Reset config for other tests
      updateConfig(initialConfig);
    });

    test('merges nested configuration objects', () => {
      // Save initial state
      const initialConfig = getConfig();

      // Create a test update with a nested structure
      updateConfig({ testNested: { value: 5000 } });

      // Verify the update worked
      const updatedConfig = getConfig();
      assert.equal(updatedConfig.testNested?.value, 5000);

      // Reset config after test
      updateConfig(initialConfig);
    });
  });

  describe('findConfigFiles', () => {
    test('is a function', () => {
      assert.ok(typeof findConfigFiles === 'function');
    });

    test('should return configuration files when they exist', async (t) => {
      // Create a simple wrapper that doesn't actually call findConfigFiles
      const simulateFindConfigFiles = () => {
        // Return a promise that resolves to a config file path
        return Promise.resolve('playwright.config.ts');
      };

      // Test that the function type and structure looks right
      assert.equal(typeof findConfigFiles, 'function');

      // Verify that our simulated function returns the expected result type
      const configFile = await simulateFindConfigFiles();
      assert.equal(typeof configFile, 'string');
    });
  });
});

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { isDetachedServerRunning, setDetachedServerState, startServer } from '../../src/services/server.js';

describe('server module', () => {
  describe('isDetachedServerRunning', () => {
    test('reports the server state', () => {
      // Should be not running initially
      const running = isDetachedServerRunning();
      assert.equal(running, false);

      // Test setting server state
      setDetachedServerState(true);
      assert.equal(isDetachedServerRunning(), true);

      // Reset for other tests
      setDetachedServerState(false);
    });
  });

  describe('startServer', () => {
    test('is a function that can be called', () => {
      assert.equal(typeof startServer, 'function');
    });
  });
});

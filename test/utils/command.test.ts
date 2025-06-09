import { describe, test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { runCommand, createCommandExecutor, cleanup } from '../../src/utils/command.js';
import type { ChildProcess } from 'child_process';

// Removed unused interface

describe('command module', () => {
  describe('runCommand', () => {
    test('is a function that executes commands', () => {
      assert.equal(typeof runCommand, 'function');
    });
  });

  describe('createCommandExecutor', () => {
    test('returns a function that executes commands', () => {
      const executor = createCommandExecutor();
      assert.equal(typeof executor, 'function');
    });
  });

  describe('cleanup', () => {
    test('removes event listeners correctly', () => {
      // Mock process and child process
      const mockProcess = {
        removeListener: mock.fn()
      };

      const mockChild = {
        removeListener: mock.fn()
      };

      const mockHandlers = {
        error: () => {},
        exit: () => {},
        ctrlC: () => {}
      };

      // Call cleanup with mocks - using unknown as intermediate cast
      cleanup(
        mockProcess as unknown as NodeJS.Process,
        mockChild as unknown as ChildProcess,
        mockHandlers
      );

      // Verify listeners were removed
      assert.equal(mockProcess.removeListener.mock.calls.length, 1);
      assert.equal(mockChild.removeListener.mock.calls.length, 3);

      // Verify the correct events were removed
      assert.equal(mockProcess.removeListener.mock.calls[0].arguments[0], 'SIGINT');
      assert.equal(mockChild.removeListener.mock.calls[0].arguments[0], 'exit');
      assert.equal(mockChild.removeListener.mock.calls[1].arguments[0], 'close');
      assert.equal(mockChild.removeListener.mock.calls[2].arguments[0], 'error');
    });
  });
});

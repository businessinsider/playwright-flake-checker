import { describe, test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { log, styled } from '../../src/utils/logger.js';
import { mock } from 'node:test';

describe('logger module', () => {
  describe('log function', () => {
    // Mocks for console methods
    let mockConsoleInfo;
    let mockConsoleError;

    beforeEach(() => {
      // Set up mocks before each test
      mockConsoleInfo = mock.method(console, 'info', () => {});
      mockConsoleError = mock.method(console, 'error', () => {});
    });

    afterEach(() => {
      // Clean up mocks after each test
      mockConsoleInfo.mock.restore();
      mockConsoleError.mock.restore();
    });

    test('provides info method that calls console.info', () => {
      const logger = log();
      logger.info('Test info message');

      assert.equal(mockConsoleInfo.mock.calls.length, 1);
      assert.deepEqual(mockConsoleInfo.mock.calls[0].arguments, ['Test info message']);
    });

    test('provides error method that calls console.error with styled error', () => {
      const logger = log();
      logger.error('Test error message');

      assert.equal(mockConsoleError.mock.calls.length, 1);
      // Error is styled, so we just check that it was called
      assert.ok(mockConsoleError.mock.calls[0].arguments.length > 0);
    });

    test('provides color methods that call console.info with chalk styling', () => {
      const logger = log();

      // Test various color methods
      logger.yellow('Yellow message');
      logger.green('Green message');
      logger.red('Red message');
      logger.cyan('Cyan message');
      logger.magenta('Magenta message');
      logger.blue('Blue message');
      logger.gray('Gray message');

      // Each call should go to console.info
      assert.equal(mockConsoleInfo.mock.calls.length, 7);
    });

    test('provides formatting methods that call console.info with chalk styling', () => {
      const logger = log();

      // Test various formatting methods
      logger.bold('Bold message');
      logger.dim('Dim message');
      logger.underline('Underlined message');
      logger.italic('Italic message');

      // Each call should go to console.info
      assert.equal(mockConsoleInfo.mock.calls.length, 4);
    });

    test('provides status methods that call console.info with styled messages', () => {
      const logger = log();

      logger.warning('Warning message');
      logger.success('Success message');

      // Each call should go to console.info
      assert.equal(mockConsoleInfo.mock.calls.length, 2);
    });
  });

  describe('styled object', () => {
    test('contains styling functions', () => {
      assert.ok(typeof styled === 'object');
      assert.ok(typeof styled.error === 'function');
      assert.ok(typeof styled.warning === 'function');
      assert.ok(typeof styled.success === 'function');
      assert.ok(typeof styled.info === 'function');
    });

    test('styling functions format messages correctly', () => {
      // Test that styled functions return formatted strings
      const errorMessage = styled.error('Test error');
      assert.ok(typeof errorMessage === 'string');
      assert.ok(errorMessage.includes('Test error'));

      const warningMessage = styled.warning('Test warning');
      assert.ok(typeof warningMessage === 'string');
      assert.ok(warningMessage.includes('Test warning'));

      const successMessage = styled.success('Test success');
      assert.ok(typeof successMessage === 'string');
      assert.ok(successMessage.includes('Test success'));

      const infoMessage = styled.info('Test info');
      assert.ok(typeof infoMessage === 'string');
      assert.ok(infoMessage.includes('Test info'));
    });
  });
});

import { displayBanner, log, styled } from './utils/logger.js';
import { runCommand } from './utils/command.js';
import { gracefulExit, handleError } from './utils/common.js';
import { findConfigFiles, updateConfig } from './config/config.js';
import { checkServerStatus, handleServerPrompt } from './services/server.js';
import { checkForIsolatedTests, getAndSelectPlaywrightTests, runPlaywrightTests } from './services/tests.js';
import { confirm, input, number } from '@inquirer/prompts';

const { error, filename, success } = styled;

/**
 * Main function to run the Flake Checker CLI tool.
 * It displays a banner, finds Playwright config files, prompts for base URL and ports,
 * and updates the configuration.
 *
 * @returns {Promise<void>}
 */
export const flakeChecker = async (): Promise<void> => {
  displayBanner();

  let playwrightConfig = await findConfigFiles();
  const confirmConfig = await confirm({
    message: `Do you want to use the Playwright config file: ${filename(playwrightConfig)}?`,
    default: true
  });

  if (!confirmConfig) {
    playwrightConfig = await findConfigFiles();
  }

  const baseUrl = await input({
    message: 'Enter the base URL your tests will run against (e.g., http://localhost):',
    default: 'http://localhost',
    validate: val => {
      if (!val) return true;
      try {
        const parsedUrl = new URL(val);

        if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
          return true;
        }

        return 'URL protocol must be http or https.';
      } catch {
        return 'Please enter a valid URL.';
      }
    }
  });

  const ports = await input({
    message: 'Enter the port(s) your server(s) run on (comma-separated, e.g., 3000,3001):',
    default: new URL(baseUrl).port || '3000',
    required: false,
    validate: val => !val || /^(\d+,)*\d+$/.test(val) || 'Please enter a comma-separated list of numbers.'
  });

  const baseUrls: string[] = [];
  if (ports) {
    const urlObj = new URL(baseUrl);
    const portList = ports.split(',');
    for (const p of portList) {
      urlObj.port = p;
      baseUrls.push(urlObj.toString().replace(/\/$/, ''));
    }
  } else {
    baseUrls.push(baseUrl);
  }

  let startServersSeparately = false;
  if (baseUrls.length > 1) {
    startServersSeparately = await confirm({
      message: 'Do these servers need to be started separately?',
      default: false,
    });
  }

  const finalBaseUrl = baseUrls[0];

  updateConfig({ baseUrl: finalBaseUrl, baseUrls, playwrightConfig, ports, startServersSeparately });

  let serverStarted = false;
  try {
    let allServersUp = true;
    for (const url of baseUrls) {
      if (!(await checkServerStatus(url, 3000))) {
        allServersUp = false;
      }
    }
    serverStarted = await handleServerPrompt(allServersUp);
  } catch (error) {
    if (error instanceof Error) handleError(error);

    serverStarted = await handleServerPrompt(false);
  }

  if (!serverStarted) {
    error('Server was not started. Exiting Flake Checker.');

    return;
  }

  const specs = await getAndSelectPlaywrightTests(playwrightConfig);

  if (!specs || specs.length === 0) {
    error('No Playwright tests found. Please ensure your configuration is correct.');

    return;
  }
  log().info(`\nSelected Playwright tests: ${specs.map((spec: { value: string; }) => filename(spec.value)).join(', ')}`);

  const isolatedTests = await checkForIsolatedTests(specs.map((spec: { value: string; }) => spec.value));

  if (!isolatedTests) gracefulExit();

  const numberOfRuns = await number({
    message: 'How many times do you want each selected test to be run?',
    default: 3,
    min: 1,
    validate: val => val! > 0 || 'Number of runs must be at least 1.'
  });

  const testExecutionResult = await runPlaywrightTests(specs.map((spec: { value: string; }) => spec.value), playwrightConfig, numberOfRuns!);

  log().cyan('\n--- Flake Check Analysis ---\n');

  if (testExecutionResult.success) {
    log().info(success('All tests passed consistently across all repetitions. No failures or flake detected!\n'));
  } else {
    log().error('\nTest failures or errors occurred during the run.');
    log().info('Attempting to open the Playwright HTML report...');
    try {
      await runCommand('npx', ['playwright', 'show-report'], {}, false, false);

      log().info('Playwright HTML report command executed. It should open in your browser.');
    } catch (reportError) {
      if (reportError instanceof Error && reportError.message !== 'Command interrupted by user.') {
        log().error('Failed to open Playwright HTML report. Please try opening it manually.');
        log().error("You can usually find it in the 'playwright-report' directory or run 'npx playwright show-report'.");
      }
    }
  }
};

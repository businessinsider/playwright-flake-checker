import { confirm } from '@inquirer/prompts';
import { select } from 'inquirer-select-pro';
import chalk from 'chalk';
import { runCommand } from '../utils/command.js';
import { gracefulExit } from '../utils/common.js';
import { log, styled } from '../utils/logger.js';
import { ESLint } from 'eslint';
import path from 'path';

const { filename, highlight, warning } = styled;

/**
 * Checks for isolated tests (tests with .only) in the specified test files.
 * @param specs - The test files to check.
 * @returns {Promise<boolean>} A promise that resolves to true if there are no isolated tests,
 * or rejects if there are isolated tests.
 */
export const checkForIsolatedTests = async (specs: string[]): Promise<boolean> => {
  const eslint = new ESLint({ cache: false });
  const pattern = specs.map(spec => `**/${spec}`);

  log().info(`\nChecking for isolated tests (${highlight('.only')}) in the following spec(s): ${specs.map(filename).join(', ')}\n`);

  const results = await eslint.lintFiles(pattern);
  const errorResults = ESLint.getErrorResults(results);
  const filesWithOnlyBasenames = errorResults.map(({ filePath }) => path.basename(filePath));
  const filesWithoutOnly = specs.filter(specFullPath => {
    const specBasename = path.basename(specFullPath);
    return !filesWithOnlyBasenames.includes(specBasename);
  });

  if (filesWithoutOnly.length > 0) {
    const confirmNonIsolatedTests = await confirm({
      message: `${warning(`The following spec(s) ${filesWithoutOnly.map(filename).join(', ')} have no isolated (${chalk.italic(`tests with ${highlight('.only')}`)}) tests and will run all tests in the spec. Continue?`)}`,
    });

    if (!confirmNonIsolatedTests) {
      const recheckNonIsolatedTests = await confirm({
        message: `Do you want to recheck ${filesWithoutOnly.map(filename).join(', ')} for isolated tests?`,
        default: true,
      });

      if (recheckNonIsolatedTests) await checkForIsolatedTests(specs);

      return false;
    }
  }

  return true;
}

/**
 * Fetches and selects Playwright test files from the specified configuration file.
 *
 * @param playwrightConfigFile - The path to the Playwright configuration file.
 * @returns {Promise<SpecOption[] | null>} A promise that resolves to an array of selected test files,
 * or null if no test files are found or an error occurs.
 * If no test files are selected, it returns an empty array.
 */
export const getAndSelectPlaywrightTests = async (playwrightConfigFile: string): Promise<SpecOption[] | null> => {
  log().info('\nFetching list of tests from Playwright...\n');
  const listArgs = ['playwright', 'test', `-c ${playwrightConfigFile}`, '--list'];
  let listResult;
  try {
    listResult = await runCommand('npx', listArgs, {}, true, true);
  } catch (error) {
    if (error instanceof Error) {
      log().red(`Error executing Playwright CLI: ${error.message}`);
    } else {
      log().red('An unknown error occurred while executing Playwright CLI.');
    }
    log().red('Please ensure Playwright is installed and the config file is correct.');

    return [];
  }

  if (!listResult.success || !listResult.output) {
    log().red('Playwright CLI --list command failed or produced no output.');
    if (listResult.output) log().error('Output:\n', listResult.output);

    return [];
  }
  const testFileRegex = /([\w/.-]+\.(?:spec|test)\.(?:js|ts|mjs|cjs))/gm;
  const allTestFiles = new Set<string>();
  let match = testFileRegex.exec(listResult.output);
  while (match !== null) {
    allTestFiles.add(match[1].trim());
    match = testFileRegex.exec(listResult.output);
  }

  const availableSpecs: string[] = Array.from(allTestFiles);

  if (availableSpecs.length === 0) {
    log().yellow('No test files found in the Playwright --list output.');
    log().info('Output from --list:\n', listResult.output);
    return null;
  }

  log().green(`Found ${highlight(`${availableSpecs.length}`)} test file(s)\n`);

  const foundSpecs: SpecOption[] = availableSpecs.map(spec => ({
    name: spec,
    value: spec,
  }));

  const selectedSpecs = await select({
    canToggleAll: true,
    confirmDelete: true,
    message: 'Select a spec file or files to run (use up/down arrows or search by typing):',
    multiple: true,
    options: async (text: string | undefined): Promise<SpecOption[]> => {
      if (!text) return foundSpecs;
      const lowerText = text.toLowerCase();
      return foundSpecs.filter(spec => spec.name.toLowerCase().includes(lowerText));
    },
    required: true,
  });

  return selectedSpecs.map(spec => ({ name: spec, value: spec }));
}

/**
 * Runs Playwright tests with the specified configuration and repeat count.
 * @param {string[]} specFiles - The test files to run.
 * @param {string} playwrightConfig - The path to the Playwright configuration file.
 * @param {number} repeatCount - The number of times to repeat each test.
 * @returns {Promise<{ success: boolean, output: string }>} A promise that resolves to an object containing the success status and output of the command.
 */
export const runPlaywrightTests = async (
  specFiles: string[],
  playwrightConfig: string,
  repeatCount: number
): Promise<{ success: boolean; output: string; }> => {
  log().magenta('\n--- Executing Playwright Tests ---\n');

  const args = ['npx', 'playwright', 'test', ...specFiles, `-c ${playwrightConfig}`, '-j 75%', `--repeat-each ${repeatCount}`, '--retries 3'];
  const result = await runCommand('PLAYWRIGHT_HTML_OPEN=\'never\'', args, {}, false, false);

  return { success: result.success, output: result.output };
}

import fs from 'fs';
import { input, select } from '@inquirer/prompts';
import { log, styled } from '../utils/logger.js';

const { filename } = styled;

let config: Config = {
  baseUrl: '',
  playwrightConfig: '',
  ports: '',
}

/**
 * Retrieves the application configuration as a readonly object.
 * Returns a copy of the config object to prevent direct modification of the original.
 *
 * @returns {Readonly<Config>} A readonly copy of the configuration object
 */
export const getConfig = (): Readonly<Config> => {
  return { ...config };
}

/**
 * Updates the global configuration by merging the current configuration
 * with the provided partial configuration.
 *
 * @param newConfig - Partial configuration object containing settings to be updated
 */
export const updateConfig = (newConfig: Partial<Config>): void => {
  config = { ...config, ...newConfig };
}

/**
 * Prompts the user to enter a configuration filename and validates its existence.
 * The function will continue to prompt until a valid file path is provided.
 *
 * @returns {Promise<string>} A Promise that resolves to the validated configuration file path
 */
export const getCustomConfig = async (): Promise<string> => {
  const customConfig = await input({
    message: 'Please enter the config filename:',
    required: true,
    validate: file => (fs.existsSync(file) ? true : 'File does not exist. Please enter a valid filename.')
  });

  log().info(`\nFound config file: ${filename(customConfig)}\n`);

  return customConfig;
}

/**
 * Searches for Playwright configuration files in the current working directory.
 *
 * This function looks for files ending with '.config.js' or '.config.ts' that
 * include a reference to '@playwright/test'. If multiple configuration files
 * are found, it presents a selection menu for the user to choose from. If no
 * configuration files are found, or if the user selects the custom option,
 * it prompts for a custom configuration file path.
 *
 * @returns {Promise<string>} A promise that resolves to either a string
 * representing the selected configuration file path, or an array of configuration paths.
 */
export const findConfigFiles = async (): Promise<string> => {
  const files = fs.readdirSync(process.cwd(), { withFileTypes: true })
    .filter(dirent => dirent.isFile() && (dirent.name.endsWith('.config.js') || dirent.name.endsWith('.config.ts')))
    .map(dirent => dirent.name)
    .filter(file => fs.readFileSync(file, 'utf8').includes('@playwright/test'));

  if (files.length === 0) {
    log().error('\nNo config files found!\n');

    return await getCustomConfig();
  }

  if (files.length > 1) log().warning('Multiple config files found!\n');

  const selectedConfig = await select({
    message: 'Please select a config file:',
    choices: [
      ...files.map(file => ({ name: file, value: file })),
      { name: 'missing config?', value: 'custom' }
    ],
  });

  if (selectedConfig === 'custom') {
    return getCustomConfig();
  }

  log().info(`\nUsing config file: ${filename(selectedConfig)}\n`);

  return selectedConfig;
};

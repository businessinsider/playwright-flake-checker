#!/usr/bin/env node

import { flakeChecker } from './flake-checker.js';

(async () => {
  try {
    await flakeChecker();
  } catch (error) {
    if (error instanceof Error) {
      console.error('An error occurred while running Flake Checker:', error.message);
    } else {
      console.error('An unknown error occurred while running Flake Checker.');
    }
    process.exit(1);
  }
})();

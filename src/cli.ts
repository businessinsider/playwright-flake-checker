#!/usr/bin/env node

import { flakeChecker } from './flake-checker.js';
import { handleError } from './utils/common.js';

(async () => {
  try {
    await flakeChecker();
  } catch (error) {
    handleError(error instanceof Error ? error : new Error(String(error)));
  }
})();

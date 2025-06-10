# <p align="left"> @businessinsider/playwright-flake-checker <a href="https://playwright.dev/" target="_blank" rel="noreferrer"> <img src="https://playwright.dev/img/playwright-logo.svg" alt="playwright" width="40" height="40"/> </a> </p>

## Overview

Playwright Flake Checker is a tool designed to help developers identify, analyze, and manage flaky tests in Playwright-based test suites. Flaky tests are tests that sometimes pass and sometimes fail without any changes to the code, making them difficult to diagnose and fix. This tool provides utilities to run, monitor, and report on flaky tests, improving the reliability of your test suite.

## Installation

To install the Playwright Flake Checker globally, run the following commands:

```bash
echo "@businessinsider:registry=https://npm.pkg.github.com" >> ~/.npmrc
```
> This is only needed if it doesn't exist in your global `.npmrc`

```bash
npm install -g @businessinsider/playwright-flake-checker
```

## Usage

### CLI
```bash
playwright-flake-checker
```

## Features

- 🔍 **Test Discovery**: Automatically discovers Playwright test files in your project
- 🎯 **Interactive Test Selection**: Choose specific tests with fuzzy search filtering
- 🔄 **Configurable Test Repetition**: Run tests multiple times to detect inconsistencies
- 🚨 **Flaky Test Detection**: Identify tests that behave inconsistently across multiple runs
- 🔎 **Isolated Test (.only) Detection**: Checks for tests with `.only` modifier
- 🖥️ **Server Management**:
  - Auto-detection of running servers
  - Ability to start your application server before running tests
  - Support for project-specific npm scripts or custom commands
  - Background server execution with automatic port handling
- 📊 **Test Results Analysis**: Concise reporting of test outcomes across repeated runs
- 🌈 **Rich Terminal UI**: Interactive prompts and colorful output for better UX
- ⚙️ **Configuration Management**: Discovers and uses your existing Playwright config

## Interactive Workflow

When you run the tool, it will guide you through the following steps:

1. **Project Configuration**:
   - Automatically finds your Playwright configuration files
   - Prompts for base URL and server ports

2. **Server Management**:
   - Checks if your application server is running
   - Offers to start the server using npm scripts or a custom command
   - Can run the server in the background while tests execute

3. **Test Selection**:
   - Lists all available Playwright test files
   - Allows searching and selecting specific tests

4. **Test Execution Configuration**:
   - Checks for isolated tests with `.only` modifier
   - Configures number of times to run each test

5. **Test Execution**:
   - Runs selected tests multiple times
   - Monitors test outcomes across runs
   - Provides analysis of potential flakes

## Requirements

- Node.js 22+
- Playwright project with test files
- ESLint configured for optimal `.only` detection

## Contributing

Contributions are welcome! Here's how you can help improve this project:

### Development Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/yourusername/playwright-flake-checker.git
   cd playwright-flake-checker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your Node.js environment:
   ```bash
   # The project uses Node.js 22+
   nvm use
   ```

### Development Workflow

1. Create a branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and write tests for them

3. Run tests to ensure everything works:
   ```bash
   npm test
   ```

4. Run ESLint to ensure code quality:
   ```bash
   npm run lint
   ```

5. Build the project to check for compilation errors:
   ```bash
   npm run build
   ```

6. Submit a pull request with a clear description of your changes

### Running the Demo Project

The demo project can be used to test your changes:

```bash
cd demo
npm install
npx playwright install
npm test # Run the tests once
npx ../ # Run your local version of the flake checker
```

## Demo Project

A minimal Playwright project is available in the [`demo`](demo/) directory. It contains a basic test that visits [playwright.dev](https://playwright.dev) and checks the page title. This demo can be used to try out the flake checker.

### Running the demo

```bash
cd demo
npm install
npx playwright install
npx playwright test # optional: run the test once
npx playwright-flake-checker
```

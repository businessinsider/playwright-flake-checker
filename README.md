# <p align="left"> @businessinsider/playwright-flake-checker <a href="https://playwright.dev/" target="_blank" rel="noreferrer"> <img src="https://playwright.dev/img/playwright-logo.svg" alt="playwright" width="40" height="40"/> </a> </p>

## Overview

Playwright Flake Checker is a tool designed to help developers identify, analyze, and manage flaky tests in Playwright-based test suites. Flaky tests are tests that sometimes pass and sometimes fail without any changes to the code, making them difficult to diagnose and fix. This tool provides utilities to run, monitor, and report on flaky tests, improving the reliability of your test suite.

## Installation

```bash
npm install -g playwright-flake-checker
```

## Usage

### CLI
```bash
npx playwright-flake-checker
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

- Node.js 18+
- Playwright project with test files
- ESLint configured for optimal `.only` detection

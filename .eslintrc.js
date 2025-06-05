module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:playwright/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'indent': ['warn', 2, { SwitchCase: 1 }],
    'linebreak-style': ['warn', 'unix'],
    'quotes': ['warn', 'single', { avoidEscape: true }],
    'semi': ['warn', 'always'],
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
    'no-process-exit': 'off',
    'no-prototype-builtins': 'warn',
    'playwright/no-focused-test': 'error',
  },
};

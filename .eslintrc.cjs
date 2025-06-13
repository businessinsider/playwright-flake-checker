module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:playwright/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [
    {
      files: ['*.ts', '*.js'],
    },
    {
      files: ['**/*.test.ts'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      parserOptions: {
        project: ['./tsconfig.test.json']
      },
      rules: {
        'playwright/no-focused-test': 'off',
        'playwright/no-skipped-test': 'off',
        'playwright/valid-title': 'off',
        'playwright/no-conditional-in-test': 'off',
        'playwright/no-force-option': 'off',
        'playwright/prefer-web-first-assertions': 'off',
        'playwright/expect-expect': 'off',
        // Relaxed rules for test files
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        'no-unused-vars': 'off'
      }
    },
    {
      files: ['.eslintrc.cjs'],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    project: ['./tsconfig.json', './tsconfig.test.json'],
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  root: true,
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

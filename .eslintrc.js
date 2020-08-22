module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'filenames',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb-typescript',
  ],
  settings: {
    'import/resolver': {
      'node': true,
      'typescript': {},
      'eslint-import-resolver-typescript': true,
    },
  },
  parserOptions: {
    // TODO - do i need two versions?
    'project': 'tsconfig.json',
    'ecmaVersion': 6,
    'sourceType': 'module',
    'ecmaFeatures': {
      'modules': true,
    },
  },
  rules: {
    'arrow-parens': ['error', 'always'],
    'curly': ['error', 'all'],
    'max-len': ['error', 120],
    'no-console': 'error',
    'no-multiple-empty-lines': 'error',
    'no-process-env': 'error',
    'no-restricted-imports': ['error', { patterns: ['./*', '../*'] }],
    'no-use-before-define': 'error',
    'object-curly-newline': ['error', { multiline: true, consistent: true }],
    'operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before' } }],
    'max-statements-per-line': ["error", { "max": 1 }],
    'brace-style': ['error', '1tbs'],
    'import/prefer-default-export': 'off',
    'filenames/match-regex': ['error', '^[a-z0-9\.-]+$', true],

    '@typescript-eslint/no-explicit-any': 'error',
    // Sadly this is too zealous, typescript can infer more
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  overrides: [
    {
      files: ['src/client/*'],
      env: {
        browser: true,
      },
    },
    {
      files: ['src/server/*'],
      env: {
        node: true,
      },
    },
    {
      files: ['src/common/game/*'],
      rules: {
        'no-param-reassign': ["error", { "props": true, "ignorePropertyModificationsFor": ["G"] }],
      }
    },
  ],
};

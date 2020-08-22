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
    'eslint-config-airbnb/hooks',
  ],
  settings: {
    'import/resolver': {
      'node': true,
      'typescript': {},
      'eslint-import-resolver-typescript': true,
    },
  },
  parserOptions: {
    project: 'tsconfig.json',
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
  rules: {
    'arrow-parens': ['error', 'always'],
    'brace-style': ['error', '1tbs'],
    'curly': ['error', 'all'],
    'filenames/match-regex': ['error', '^[a-z0-9.-]+$', true],
    'import/prefer-default-export': 'off',
    'max-len': ['error', 120],
    'max-statements-per-line': ['error', { max: 1 }],
    'no-console': 'error',
    'no-multiple-empty-lines': 'error',
    'no-process-env': 'error',
    'no-restricted-imports': ['error', { patterns: ['./*', '../*'] }],
    'no-undef': 'error',
    'no-use-before-define': 'error',
    'object-curly-newline': ['error', { multiline: true, consistent: true }],
    'operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before' } }],
    'quote-props': ['error', 'consistent-as-needed'],

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
        'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['G'] }],
      },
    },
  ],
};

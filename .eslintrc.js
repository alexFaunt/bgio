module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'filenames',
    'jest',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb-typescript',
    'eslint-config-airbnb/hooks',
    'plugin:jest/recommended',
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
    'max-classes-per-file': 'off',
    'max-len': ['error', 120],
    'max-statements-per-line': ['error', { max: 1 }],
    'no-console': 'warn', // TODO
    'no-multiple-empty-lines': 'error',
    'no-process-env': 'error',
    'no-restricted-imports': ['error', { patterns: ['./*', '../*'] }],
    'no-undef': 'error',
    'no-use-before-define': 'error',
    'object-curly-newline': ['error', { multiline: true, consistent: true }],
    'operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before' } }],
    'quote-props': ['error', 'consistent-as-needed'],

    'filenames/match-regex': ['error', '^[a-z0-9.-]+$', true],

    'import/prefer-default-export': 'off',
    'import/no-cycle': 'off',

    'react/require-default-props': 'off',

    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/lines-between-class-members': 'off',
    // Sadly this is too zealous, typescript can infer more
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  overrides: [
    {
      files: ['src/client/*', 'src/client/**'],
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
      files: ['*.test.ts'],
      env: {
        jest: true,
      },
      rules: {
        'jest/expect-expect': 'error',
      }
    },
    {
      files: ['src/common/game/*'],
      rules: {
        'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['acc', 'G'] }],
      },
    },
    {
      files: ['src/server/db/migrations/*'],
      rules: {
        'filenames/match-regex': ['error', '^[0-9]{14}_[a-z_]+$', true],
      },
    },
  ],
};

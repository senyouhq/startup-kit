module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: ['standard', 'eslint:recommended', 'plugin:react/recommended', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', 'prettier', 'import'],
  rules: {
    'react/prop-types': 'off',

    // https://ja.reactjs.org/docs/hooks-rules.html#eslint-plugin
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off', // warnでも良いけどうるさくなるので一旦off

    'prettier/prettier': [
      'error',
      {
        arrowParens: 'always',
        printWidth: 100,
        trailingComma: 'es5',
        singleQuote: true,
        jsxBracketSameLine: false,
        semi: false,
      },
    ],
    'import/order': [
      'warn',
      {
        groups: [['builtin', 'external'], 'internal', ['parent', 'index', 'sibling']],
        'newlines-between': 'ignore',
      },
    ],
    'no-case-declarations': 'off',
  },
}

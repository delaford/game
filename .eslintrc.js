module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/airbnb',
  ],
  rules: {
    'import/extensions': 0,
    'no-restricted-syntax': 0,
    'import/first': 0,
    'import/no-cycle': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-param-reassign': [2, { props: false }],
    'no-case-declarations': 0,
    indent: ['error', 2],
  },
  settings: {
    'import/resolver': {
      'babel-plugin-root-import': {
        rootPathPrefix: '@server',
        rootPathSuffix: 'server',
      },
    },
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};

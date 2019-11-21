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
    'import/extensions': 'never',
    'import/first': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-param-reassign': [2, { props: false }],
    'no-case-declarations': 0,
    indent: ['error', 2],
  },
  settings: {
    'import/resolver': {
      'babel-plugin-root-import': {
        rootPathPrefix: '@',
        rootPathSuffix: 'server',
      },
    },
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};

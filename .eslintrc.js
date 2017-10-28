module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2017
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true
  },
  rules: {
    // 'no-console': 'off',
    // 'no-debugger': 'off'
    'no-ex-assign': 'off',
    'no-unused-vars': ['error', { args: 'none' }]
  }
};

module.exports = {
  root: true,
  env: {
    node: true,
    jquery: true
  },
  'extends': [
    'plugin:vue/essential',
    // 'eslint:recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? ['error', { allow: ["warn", "error"] }] : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "no-unused-vars": ["error", { "vars": "all", "args": "none", "ignoreRestSiblings": false }],
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}

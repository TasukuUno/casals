module.exports = {
  extends: 'google',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'new-cap': 0,
    'require-jsdoc': 0,
    'max-len': ["error", { "code": 120 }],
  }
};

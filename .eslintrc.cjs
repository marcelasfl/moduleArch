/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript/recommended",
    "@vue/eslint-config-prettier",
  ],
  env: {
    "vue/setup-compiler-macros": true,
  },
  rules: {
    "comma-dangle": "off",
    "@typescript-eslint/comma-dangle": "off",
    "prettier/prettier": ["error", { endOfLine: "off" }],
    "javascript.validate.enable": false,
    'no-console': 'error', 
    'no-debugger': 'error',
  },
};


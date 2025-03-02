import globals from "globals";
import myStyle from "eslint-config-ejohnso49";

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...myStyle,
  {
    languageOptions: {
      globals: globals.node,
      ecmaVersion: "latest",
    },
  },
  {
    ignores: ["dist/**"],
  },
];

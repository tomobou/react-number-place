module.exports = [
  // Recommended configurations from plugins
  {
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      react: require("eslint-plugin-react"),
      "react-hooks": require("eslint-plugin-react-hooks"),
      "jsx-a11y": require("eslint-plugin-jsx-a11y"),
      prettier: require("eslint-plugin-prettier"),
    },
    settings: { react: { version: "detect" } },
    ignores: [],
    rules: { "prettier/prettier": "error" },
  },
];

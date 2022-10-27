module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: [
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jest"],
  root: true,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  rules: {
    "max-len": [
      "error",
      { ignoreComments: true, ignorePattern: "^\\s*it.*\\{$" },
    ],
    "no-alert": "off",
    "no-plusplus": "off",
    "no-use-before-define": "off",
    "import/prefer-default-export": "off",
    "@typescript-eslint/no-var-requires": "off",
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    "import/no-extraneous-dependencies": "off",
    "import/extensions": "off",
    "@typescript-eslint/no-use-before-define": "off",
  },
  overrides: [
    {
      files: ["setupJest.js"],
      rules: {
        "no-undef": "off",
        "import/no-extraneous-dependencies": "off",
      },
    },
    {
      files: ["jest.config.js"],
      rules: {
        "max-len": "off",
      },
    },
    {
      files: ["*.test.[tj]s"],
      rules: {
        "no-await-in-loop": "off",
        "no-restricted-syntax": "off",
        "max-len": "off",
        "@typescript-eslint/no-shadow": "off",
      },
    },
  ],
};

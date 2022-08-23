module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "max-len": [
      "error",
      { ignoreComments: true, ignorePattern: "^\\s*it.*\\{$" },
    ],
    "no-alert": "off",
    "no-use-before-define": "off",
    "import/prefer-default-export": "off",
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
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
      files: ["*.test.js"],
      rules: {
        "no-await-in-loop": "off",
        "no-restricted-syntax": "off",
      },
    },
  ],
  plugins: ["jest"],
};

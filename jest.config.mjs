/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  //  We're using ts-jest for typescript support. Treat *.ts files as ESM
  //  modules so that we can use 'import'.
  //  See:
  //    https://kulshekhar.github.io/ts-jest/docs/next/guides/esm-support/
  preset: "ts-jest",
  resolver: "ts-jest-resolver",
  // extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "identity-obj-proxy",
    "\\.(css|less)$": "identity-obj-proxy",
  },
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    "^.+\\.[tj]s$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          allowJs: true,
        },
      },
    ],
  },

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,ts,jsx,tsx}"],

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // The test environment that will be used for testing
  testEnvironment: "jsdom",
  setupFiles: ["react-app-polyfill/jsdom"],
  setupFilesAfterEnv: ["./setup-jest.js"],
};

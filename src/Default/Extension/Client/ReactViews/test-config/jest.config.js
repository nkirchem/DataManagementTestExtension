const { jestModuleNameMappings } = require("@microsoft/azureportal-reactview/jestModuleNameMappings");

module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    rootDir: "../",
    setupFiles: [
        "<rootDir>/test-config/globalTestSetup.ts",
    ],
    globals: {
        "ts-jest": {
            tsConfig: "tsconfig.test.json",
        },
    },
    transform: {
        "^.+\\.tsx?$": ["ts-jest"],
        "\\.resx$": "@microsoft/azureportal-reactview/resxTransformer",
        "ClientResources": "@microsoft/azureportal-reactview/resxTransformer",
    },
    coveragePathIgnorePatterns: [".test.tsx", ".test.ts", "globalTestSetup.ts", "testUtils.ts"],
    coverageProvider: "babel",
    collectCoverage: true,
    coverageReporters: [
        "text",
        "lcov",
    ],
    testMatch: [
        "<rootDir>/**/__tests__/**/*.(spec|test).[jt]s?(x)",
        "<rootDir>/*.(spec|test).[tj]s?(x)",
        "<rootDir>/**/*.(spec|test).[tj]s?(x)",
    ],
    testPathIgnorePatterns: ["/node_modules/"],
    collectCoverageFrom: [
        "**/*.{ts,tsx}",
        "!**/node_modules/**",
    ],
    moduleNameMapper: {
        ...jestModuleNameMappings,
        "ClientResources": "<rootDir>/../ClientResources.resx",
    },
};

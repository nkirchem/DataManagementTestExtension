import type { Config } from "jest";
import { jestModuleNameMappings } from "@microsoft/azureportal-reactview/test-support/jestModuleNameMappings";

const config: Config = {
    collectCoverage: true,
    collectCoverageFrom: [
        "**/*.{ts,tsx}",
        "!**/*.d.ts",
        "!**/*.resjson.ts",
        "!**/node_modules/**",
        "!test-config/**",
    ],
    coveragePathIgnorePatterns: [
        ".test.tsx",
        ".test.ts",
        "globalTestSetup.ts",
    ],
    coverageProvider: "babel",
    coverageReporters: [
        "text",
        "lcov",
    ],
    moduleNameMapper: {
        ...jestModuleNameMappings,
    },
    preset: "ts-jest",
    reporters: [
        "default",
        "jest-junit",
    ],
    rootDir: "../",
    setupFiles: [
        "<rootDir>/test-config/globalTestSetup.ts",
    ],
    setupFilesAfterEnv: [
        "<rootDir>/test-config/globalTestSetupAfterEnv.ts",
    ],
    testEnvironment: "jsdom",
    testMatch: [
        "<rootDir>/**/__tests__/**/*.(spec|test).[jt]s?(x)",
        "<rootDir>/*.(spec|test).[tj]s?(x)",
        "<rootDir>/**/*.(spec|test).[tj]s?(x)",
    ],
    testPathIgnorePatterns: [
        "/node_modules/",
    ],
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.test.json",
            },
        ],
    },
};

export default config;

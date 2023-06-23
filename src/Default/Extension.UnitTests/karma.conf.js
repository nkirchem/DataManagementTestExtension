// Karma configuration
// Generated on Fri Feb 16 2018 15:06:08 GMT-0800 (Pacific Standard Time)

module.exports = function (config) {
    let process = require("process");

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "../",

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["mocha"],

        plugins: [
            require("karma-mocha"),
            require("karma-mocha-reporter"),
            require("karma-edge-launcher"),
            require("karma-coverage"), // Include if you want coverage
            require("karma-chrome-launcher"),
            require("karma-junit-reporter"),  // Include if you want junit reporting
            require("karma-trx-reporter"),   // Include if you want trx reporting
        ],
        // list of files / patterns to load in the browser
        files: [
            // chai assertion framework.
            { pattern: "Extension.UnitTests/node_modules/chai/**/*.js", included: false },
            // sinonjs used for mocking xhr.
            { pattern: "Extension.UnitTests/node_modules/sinon/**/*.js", included: false },
            // aggregate script of portal bundles required for test.
            "Extension.UnitTests/node_modules/@microsoft/azureportal-ut/lib/FxScripts.js",
            // karma requirejs adapter required to successfully load requirejs in karma.
            "Extension.UnitTests/node_modules/karma-requirejs/lib/adapter.js",
            // generated require configs for extension resx files.
            { pattern: "Extension.UnitTests/_generated/Ext/**/*RequireConfig.js", included: true },
            // @microsoft/azureportal-ut test harness and other test scripts you may load within a unit test.
            { pattern: "Extension.UnitTests/node_modules/@microsoft/azureportal-ut/lib/*.js", included: false },
            // portal framework scripts.
            { pattern: "Extension.UnitTests/node_modules/@microsoft/azureportal-ut/lib/fx/Content/Scripts/**/*.js", included: false },
            // reserved directory for generated content for framework.
            { pattern: "Extension.UnitTests/_generated/Fx/**/*.js", included: false },
            // generated content for extension.
            { pattern: "Extension.UnitTests/_generated/Ext/**/*.js", included: false },
            // make available compiled tests from tsconfig.json outDir
            { pattern: "Extension.UnitTests/Output/**/*.js", included: false },
            // make available all client extension code that unit tests will use.
            { pattern: "Extension/Output/Content/Scripts/**/*.js", included: false },
            // the entrypoint for running unit tests.
            "Extension.UnitTests/test-main.js",
        ],

        client: {
            mocha: {
                reporter: "html",
                ui: "bdd",
            },
        },

        // list of files / patterns to exclude
        exclude: [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            "./Extension/Output/Content/Scripts/**/*.js": "coverage",
        },

        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["mocha", "trx", "junit", "coverage"],

        // the default trx configuration
        trxReporter: { outputFile: "./TestResults/test-results.trx", shortTestName: false },

        junitReporter: {
            outputDir: "./Extension.UnitTests/TestResults", // results will be saved as $outputDir/$browserName.xml
            outputFile: "test-results.xml", // if included, results will be saved as $outputDir/$browserName/$outputFile
            suite: "Extension.UnitTests", // suite will become the package name attribute in xml testsuite element
            useBrowserName: true, // add browser name to report and classes names
            nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
            classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
            properties: {}, // key value pair of properties to add to the <properties> section of the report
        },

        mochaReporter: {
            showDiff: true,
        },

        coverageReporter: {
            type: "html",
            dir: "./Extension.UnitTests/TestResults/coverage/",
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ["Chrome_No_Sandbox"],

        customLaunchers: {
            Chrome_No_Sandbox: {
                base: "ChromeHeadless",
                flags: ["--no-sandbox"],
            },
        },
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,
    });
};

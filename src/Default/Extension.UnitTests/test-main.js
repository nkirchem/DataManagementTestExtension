window.fx.environment.armEndpoint = "https://management.azure.com";
window.fx.environment.armApiVersion = "2014-04-01";

const allTestFiles = [];
if (window.__karma__) {
    const TEST_REGEXP = /^\/base\/Extension.UnitTests\/Output\/.*(?:spec|test)\.js$/i;
    // Get a list of all the test files to include
    Object.keys(window.__karma__.files).forEach(function (file) {
        if (TEST_REGEXP.test(file)) {
            // Normalize paths to RequireJS module names.
            // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
            // then do not normalize the paths
            const normalizedTestModule = file.replace(/^\/base\/Extension.UnitTests\/|\.js$/g, "");
            allTestFiles.push(normalizedTestModule);
        }
    });
}

mocha.setup({
    ui: "bdd",
    timeout: 60000,
    ignoreLeaks: false,
    globals: [],
});

rjs = require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: window.__karma__ ? "/base/Extension.UnitTests" : "",
    paths: {
        "_generated": "../Extension/Output/Content/Scripts/_generated",
        "Views": "../Extension/Output/Content/Scripts/Views",
        "sinon": "node_modules/sinon/pkg/sinon",
        "chai": "node_modules/chai/chai",
    },
    // dynamically load all test files
    deps: allTestFiles,

    // kickoff karma or mocha
    callback: window.__karma__ ? window.__karma__.start : function () { return mocha.run(); },
});

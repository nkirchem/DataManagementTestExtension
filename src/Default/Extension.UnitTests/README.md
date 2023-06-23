# Build

In Visual Studio > `Ctl + shift + B`

or `npm run build` from the command line

# Running Tests

Run the following from the command line in the root of your *.UnitTest directory
- `npm run test`: this will run karmajs in watch mode. Note this is also useful when you also have configured tsc for compile on save.
- or `npm run test-ci`: this will run karmajs with a single run rather than watch mode.

# Test output

JUNIT and TRX results will be written to ./TestResults
Code Coverage report will be written to ./TestResults

# Scripts

Useful scripts for running tests are defined in package.json

For latest info see https://aka.ms/portalfx/ut
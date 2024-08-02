# Azure Portal DataManagementTest extension

## Getting Started

1. Navigate to the `src` directory.
1. Run `npm install` to install the necessary npm packages. You can also use the equivalent yarn or pnpm command.
1. Run `npm start` to build, serve, and sideload the extension for development and testing.

## Extension Structure

| File / Directory | Description |
|------------------|-------------|
|`cloudtest`|Contains test maps and scripts for running extension tests on CloudTest.|
|`deployment`|Contains configuration files and artifacts required for extension deployment.|
|`e2etests`|Contains Playwright end-to-end tests for the extension.|
|`src`|Contains the extension's source code, including both ReactViews and DxViews. The `__test__` subdirectory contains unit tests for ReactViews.|
|`extension.config.json`|Contains configuration properties for the extension.|

## Documentation

For more detailed information, refer to the following documentation:

- [Extension onboarding](https://aka.ms/portalfx/rpdocs)
- [Declarative Views](https://aka.ms/portalfx/declarative)
- [ReactViews](https://aka.ms/portalfx/reactdocs)

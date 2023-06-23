// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getReactViewBuild } = require("@microsoft/azureportal-reactview-tools/webpack.config");
const builder = getReactViewBuild();

// Set relative path to the output directory and the devServerConfig.json file
builder.setOutputDirectory("../../Output/Content/Scripts/ReactViews");
builder.setDevServerConfigPath("../../devServerConfig.json");

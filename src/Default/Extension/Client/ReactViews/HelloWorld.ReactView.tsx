import * as Az from "@microsoft/azureportal-reactview/Az";
import * as React from "react";
import { Text } from "@fluentui/react/lib/Text";
import { Resources } from "./Resources.resjson";

Az.setTitle(Resources.HelloWorldTitle);

const HelloWorld = () => {
    return <Text data-testid="helloworld-text-testid">{Resources.HelloWorldMessage}</Text>;
};

export default HelloWorld;

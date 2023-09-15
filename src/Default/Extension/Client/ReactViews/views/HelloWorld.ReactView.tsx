import * as React from "react";
import { setTitle } from "@microsoft/azureportal-reactview/Az";
import { BladeLink } from "@microsoft/azureportal-reactview/BladeLink";
import { Text } from "@fluentui/react";
import { Resources } from "../Resources.resjson";

setTitle(Resources.HelloWorldTitle);

const HelloWorld = () => {
    return <div>
        <Text data-testid="helloworld-text-testid">{Resources.HelloWorldMessage}</Text>
        <div>
            <BladeLink bladeReference={{ bladeName: "SubscriptionList.ReactView", extensionName: "DataManagementTest" }}>View Subscriptions</BladeLink>
        </div>
    </div>;
};

export default HelloWorld;

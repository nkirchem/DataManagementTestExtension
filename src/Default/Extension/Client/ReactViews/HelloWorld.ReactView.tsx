import * as Az from "@microsoft/azureportal-reactview/Az";
import { DialogType, showDialog } from "@microsoft/azureportal-reactview/Dialog";
import { StatusBarType, showStatusBar } from "@microsoft/azureportal-reactview/StatusBar";
import * as React from "react";
import { Text } from "@fluentui/react/lib/Text";
import { Resources } from "./Resources.resjson";
import { DefaultButton, PrimaryButton } from "@fluentui/react";

Az.setTitle(Resources.HelloWorldTitle);

const HelloWorld = () => {
    return <div>
        <Text data-testid="helloworld-text-testid">{Resources.HelloWorldMessage}</Text>
        <PrimaryButton text="Open dialog" onClick={() => showDialog({ content: <b>Okay!</b>, title: "Title!", kind: DialogType.OKCancel })} />
        <DefaultButton text="Show status bar" onClick={() => showStatusBar(StatusBarType.Info, `Status bar message ${Date.now()}`)} />
    </div>;
};

export default HelloWorld;

import { setTitle } from "@microsoft/azureportal-reactview/Az";
import { BladeReferences } from "@microsoft/azureportal-reactview/Navigation";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import * as React from "react";
import { SubscriptionDetails } from "./Components/SubscriptionDetails";
import { ResourceCommandBar } from "./Components/ResourceCommandBar";
import { ResourceListViewContextProvider } from "./ResourceListView.Context";
import { IResourceListViewProps } from "./ResourceListView.types";
import { BladeLink } from "@microsoft/azureportal-reactview/BladeLink";
import { ResourceDetails } from "./Components/ResourceDetails";

setTitle("Subscription resources");

const ResourceListView: React.FC<IResourceListViewProps> = (props) => {
  console.log(`Render ResourceListView - ${props.parameters.subscriptionId}`);

  return (
    <ResourceListViewContextProvider subscriptionId={props.parameters.subscriptionId}>
      <div>
        <ResourceCommandBar />
        <div>
          <BladeLink
            bladeReference={BladeReferences.forBlade("SubscriptionListView.ReactView").createReference()}
          >
            Back to all subscriptions
          </BladeLink>
        </div>
        <div className={mergeStyles({ display: "flex", flexDirection: "row" })}>
          <div className={mergeStyles({ grow: 1, maxWidth: "850px" })}>
            <SubscriptionDetails />
          </div>
          <div className={mergeStyles({ grow: 1, padding: "0 20px" })}>
            <ResourceDetails />
          </div>
        </div>
      </div>
    </ResourceListViewContextProvider>
  );
};

export default ResourceListView;

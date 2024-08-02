import { mergeStyles } from "@fluentui/react";
import * as React from "react";
import { resourceListViewConnector } from "../ResourceListView.Context";
import { ResourceList } from "./ResourceList";
import { Shimmer } from "@microsoft/azureportal-reactview/Shimmer";

export const SubscriptionDetails = resourceListViewConnector.connect(
  (ctx) => ({
    subscription: ctx.subscription,
    dispatch: ctx.dispatch,
  }),
  (props) => {
    console.log(`Render SubscriptionDetails`);

    const { subscription } = props;
    return (
      <div className={mergeStyles({ marginTop: "20px" })}>
        <div className={mergeStyles({ height: "48px" })}>
          <div className={mergeStyles({ fontWeight: "bold" })}>
            <Shimmer isDataLoaded={Boolean(subscription)} initialDelay={200}>{subscription?.displayName}</Shimmer>
          </div>
          <div className={mergeStyles({ color: "#888" })}>
            <Shimmer isDataLoaded={Boolean(subscription)} initialDelay={200}><div>Id: {subscription?.subscriptionId}</div></Shimmer>
          </div>
        </div>
        <div>
          <ResourceList />
        </div>
      </div>
    );
  }
);

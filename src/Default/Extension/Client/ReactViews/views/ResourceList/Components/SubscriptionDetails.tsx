import { Shimmer, mergeStyles } from "@fluentui/react";
import * as React from "react";
import { resourceListViewConnector } from "../ResourceListView.Context";
import { ResourceList } from "./ResourceList";

export const SubscriptionDetails = resourceListViewConnector.connect(
  (ctx) => ({
    subscription: ctx.subscription,
    dispatch: ctx.dispatch,
  }),
  (props) => {
    console.log(`Render SubscriptionDetails`);

    const { subscription } = props;
    return (
      <div className={mergeStyles({ margin: "20px 0", minHeight: "36px" })}>
        <div>
          <div className={mergeStyles({ fontWeight: "bold" })}>
            <Shimmer isDataLoaded={Boolean(subscription)}>{subscription?.displayName}</Shimmer>
          </div>
          <div className={mergeStyles({ color: "#888" })}>
            <Shimmer isDataLoaded={Boolean(subscription)}>Id: {subscription?.subscriptionId}</Shimmer>
          </div>
          <div>
            <ResourceList />
          </div>
        </div>
      </div>
    );
  }
);

import { mergeStyles } from "@fluentui/react";
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
        {!subscription ? (
          <div>Loading subscription...</div>
        ) : (
          <div>
            <div className={mergeStyles({ fontWeight: "bold" })}>{subscription.displayName}</div>
            <div className={mergeStyles({ color: "#888" })}>Id: {subscription.subscriptionId}</div>
            <div>
              <ResourceList />
            </div>
          </div>
        )}
      </div>
    );
  }
);

import {
  SelectionMode,
  ShimmeredDetailsList,
  mergeStyles,
} from "@fluentui/react";
import * as React from "react";
import { Subscription } from "@microsoft/azureportal-reactview/Az";
import { Resource } from "../Api/subscriptionApis";

export interface ISubscriptionDetailsProps {
  subscription?: Subscription;
  subscriptionResources?: Resource[];
  subscriptionResourcesLoading?: boolean;
}

export const SubscriptionDetails: React.FC<ISubscriptionDetailsProps> = (
  props
) => {
  console.log(`Render SubscriptionDetails`);

  const { subscription, subscriptionResources, subscriptionResourcesLoading } =
    props;

  return (
    <div className={mergeStyles({ margin: "20px 0", minHeight: "36px" })}>
      {!subscription ? (
        <div>Select a subscription to show its details</div>
      ) : (
        <div>
          <div className={mergeStyles({ fontWeight: "bold" })}>
            {subscription.displayName}
          </div>
          <div className={mergeStyles({ color: "#888" })}>
            Id: {subscription.subscriptionId}
          </div>
          <div>
            <h4 className={mergeStyles({ marginTop: "40px" })}>Subscription resources:</h4>
            {subscriptionResources?.length || subscriptionResourcesLoading ? (
              <ShimmeredDetailsList
                columns={[
                  {
                    key: "name",
                    name: "Name",
                    minWidth: 250,
                    isResizable: true,
                    onRender: (item) => item.name,
                  },
                  {
                    key: "type",
                    name: "Type",
                    minWidth: 200,
                    isResizable: true,
                    onRender: (item) => item.type,
                  },
                  {
                    key: "location",
                    name: "Resource ID",
                    minWidth: 120,
                    isResizable: true,
                    onRender: (item) => item.location,
                  },
                  {
                    key: "id",
                    name: "Resource ID",
                    minWidth: 260,
                    isResizable: true,
                    onRender: (item) => item.id,
                  },
                ]}
                enableShimmer={subscriptionResourcesLoading}
                items={subscriptionResources?.slice(0, 12) || []}
                selectionMode={SelectionMode.none}
              />
            ) : (
              <div>This subscription does not contain any resources.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

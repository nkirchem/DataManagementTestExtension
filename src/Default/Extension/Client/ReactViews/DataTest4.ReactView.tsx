import { mergeStyles } from "@fluentui/react/lib/Styling";
import * as React from "react";
import { NavHeader } from "./Components/NavHeader";
import { SubscriptionList } from "./Components/SubscriptionList";
import { SubscriptionDetails } from "./Components/SubscriptionDetails";
import { SubscriptionCommandBar } from "./Components/SubscriptionCommandBar";
import { DataTest4ContextProvider, connectDataTest4Component } from "./DataTest4.Context";
import { IDataTestViewProps } from "./DataTest.types";
import { getContextSelector } from "./Platform/dataManagement";

const DataTest: React.FC<IDataTestViewProps> = (props) => {
  console.log(`Render DataTest4.ReactView - ${props.parameters.selectedSubscriptionId}`);

  return (
    <DataTest4ContextProvider selectedSubscriptionId={props.parameters.selectedSubscriptionId}>
      <div>
        <NavHeaderWrapper currentViewName="DataTest4.ReactView" />
        <SubscriptionCommandBarWrapper />
        <div className={mergeStyles({ display: "flex", flexDirection: "row" })}>
          <div className={mergeStyles({ width: "50%" })}>
            <SubscriptionListWrapper />
          </div>
          <div className={mergeStyles({ width: "50%", padding: "0 20px" })}>
            <SubscriptionDetailsWrapper />
          </div>
        </div>
      </div>
    </DataTest4ContextProvider>
  );
};

const SubscriptionCommandBarWrapper = connectDataTest4Component(
  getContextSelector(["subscriptionsLoading", "reloadSubscriptions"]),
  (props) => <SubscriptionCommandBar loading={props.subscriptionsLoading} refresh={props.reloadSubscriptions} />
);

const NavHeaderWrapper = connectDataTest4Component<{ currentViewName: string }, { selectedSubscriptionId?: string }>(
  getContextSelector(["selectedSubscriptionId"]),
  (props) => <NavHeader {...props} />
);

const SubscriptionDetailsWrapper = connectDataTest4Component(
  getContextSelector(["selectedSubscription", "subscriptionResources", "subscriptionResourcesLoading"]),
  (props) => (
    <SubscriptionDetails
      subscription={props.selectedSubscription}
      subscriptionResources={props.subscriptionResources}
      subscriptionResourcesLoading={props.subscriptionResourcesLoading}
    />
  )
);

const SubscriptionListWrapper = connectDataTest4Component(
  context => ({
    dispatch: context.dispatch,
    loading: context.subscriptionInitialLoad,
    initialSelectedSubscriptionId: context.initialSelectedSubscriptionId,
    subscriptions: context.subscriptions
  }),
  (props) => (
    <SubscriptionList
      initialSelectedSubscriptionId={props.initialSelectedSubscriptionId}
      loading={props.loading}
      onSelectionChanged={(selectedSubscriptionId) => {
        props.dispatch({ selectedSubscriptionId });
      }}
      subscriptions={props.subscriptions}
    />
  )
);

export default DataTest;

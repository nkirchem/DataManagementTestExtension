import { mergeStyles } from "@fluentui/react/lib/Styling";
import * as React from "react";
import { NavHeader } from "./Components/NavHeader";
import { SubscriptionList } from "./Components/SubscriptionList";
import { SubscriptionDetails } from "./Components/SubscriptionDetails";
import { SubscriptionCommandBar } from "./Components/SubscriptionCommandBar";
import { DataTest4ContextProvider, connectDataTest4Component } from "./DataTest4.Context";
import { IDataTestViewProps } from "./DataTest.types";

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

const SubscriptionCommandBarWrapper = connectDataTest4Component(["subscriptionsLoading", "reloadSubscriptions"], props => 
  <SubscriptionCommandBar loading={props.subscriptionsLoading} refresh={props.reloadSubscriptions} />);

const NavHeaderWrapper = connectDataTest4Component<{ currentViewName: string }, "selectedSubscriptionId">(["selectedSubscriptionId"], props =>
  <NavHeader {...props} />);

const SubscriptionDetailsWrapper = connectDataTest4Component(["selectedSubscription", "subscriptionResources", "subscriptionResourcesLoading"], props =>
  <SubscriptionDetails
    subscription={props.selectedSubscription}
    subscriptionResources={props.subscriptionResources}
    subscriptionResourcesLoading={props.subscriptionResourcesLoading}
  />
);

const SubscriptionListWrapper = connectDataTest4Component(["initialSelectedSubscriptionId", "subscriptionInitialLoad", "dispatch", "subscriptions"], props =>
  <SubscriptionList
    loading={props.subscriptionInitialLoad}
    initialSelectedSubscriptionId={props.initialSelectedSubscriptionId}
    onSelectionChanged={selectedSubscriptionId => {
      props.dispatch({ selectedSubscriptionId });
    }}
    subscriptions={props.subscriptions}
  />
);

export default DataTest;

/*
// Below shows the other method of connecting components using createContextConnect and explicit React.memo 

const connectNavHeader = createDataTest4ContextSelector((context) => ({
  selectedSubscriptionId: context.selectedSubscriptionId,
}));
const NavHeaderWrapper = connectNavHeader(
  React.memo(({ selectedSubscriptionId }) => (
    <NavHeader currentViewName="DataTest4.ReactView" currentSubscriptionId={selectedSubscriptionId} />
  ))
);

const connectSubscriptionCommandBar = createDataTest4ContextSelector((context) => ({
  loading: context.subscriptionsLoading,
  refresh: context.reloadSubscriptions,
}));
const SubscriptionCommandBarWrapper = connectSubscriptionCommandBar(
  React.memo(({ loading, refresh }) => (
    <SubscriptionCommandBar loading={loading} refresh={refresh} />
  ))
);

const connectSubscriptionDetails = createDataTest4ContextSelector((context) => ({
  selectedSubscriptionId: context.selectedSubscriptionId,
  subscriptions: context.subscriptions,
  subscriptionResources: context.subscriptionResources,
  subscriptionResourcesLoading: context.subscriptionResourcesLoading,
}));
const SubscriptionDetailsWrapper = connectSubscriptionDetails(
  React.memo(({ selectedSubscriptionId, subscriptions, subscriptionResources, subscriptionResourcesLoading }) => {
    return (
      <SubscriptionDetails
        subscription={subscriptions?.find(
          (s) => s.subscriptionId === selectedSubscriptionId
        )}
        subscriptionResources={subscriptionResources}
        subscriptionResourcesLoading={subscriptionResourcesLoading}
      />
    );
  })
);

const connectSubscriptionList = createDataTest4ContextSelector((context) => ({
    dispatch: context.dispatch,
    initialSelectedSubscriptionId: context.initialSelectedSubscriptionId,
    loading: Boolean(context.subscriptionsLoading && !context.subscriptions),
    subscriptions: context.subscriptions
}));
const SubscriptionListWrapper = connectSubscriptionList(
  React.memo(({ dispatch, initialSelectedSubscriptionId, loading, subscriptions }) => (
    <SubscriptionList
        loading={loading}
        initialSelectedSubscriptionId={initialSelectedSubscriptionId}
        onSelectionChanged={selectedSubscriptionId => {
          dispatch({ selectedSubscriptionId });
        }}
        subscriptions={subscriptions}
    />
  ))
);
*/

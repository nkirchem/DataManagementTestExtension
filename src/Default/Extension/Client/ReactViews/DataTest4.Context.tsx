import * as React from "react";
import { Subscription } from "@microsoft/azureportal-reactview/Az";
import { createComponentConnector, useMemoizeObject, usePropertyBag } from "./Platform/dataManagement";
import { useSubscriptionResources, useSubscriptions } from "./Api/subscriptionHooks";
import { Resource } from "./Api/subscriptionApis";

export interface IDataTest4ViewProps {
    selectedSubscriptionId?: string;
};

export type IDataTest4Context = {
    initialSelectedSubscriptionId?: string;
    selectedSubscriptionId?: string;
    selectedSubscription?: Subscription;
    subscriptions?: Subscription[];
    subscriptionInitialLoad?: boolean;
    subscriptionLoadError?: Error;
    subscriptionsLoading?: boolean;
    subscriptionResources?: Resource[];
    subscriptionResourcesLoadError?: Error;
    subscriptionResourcesLoading?: boolean;
    reloadSubscriptions(): Promise<Subscription[]>;
    dispatch: React.Dispatch<Partial<DataTest4State>>;
};

export type DataTest4State = {
    selectedSubscriptionId?: string;
}

const DataTest4Context = React.createContext<IDataTest4Context>({ dispatch: () => {}, reloadSubscriptions: async () => ([]) });

export const DataTest4ContextProvider = React.memo((props: React.PropsWithChildren<IDataTest4ViewProps>) => {
    const [bladeState, dispatch] = usePropertyBag<DataTest4State>({ selectedSubscriptionId: props.selectedSubscriptionId });

    const { result: subscriptions, refresh: reloadSubscriptions, error: subscriptionLoadError, loading: subscriptionsLoading } = useSubscriptions();
    const { result: subscriptionResources, error: subscriptionResourcesLoadError, loading: subscriptionResourcesLoading } = useSubscriptionResources(bladeState.selectedSubscriptionId);

    const contextValue = useMemoizeObject({
        ...bladeState,
        initialSelectedSubscriptionId: props.selectedSubscriptionId,
        selectedSubscription: subscriptions?.find(s => s.subscriptionId === bladeState.selectedSubscriptionId),
        subscriptions,
        subscriptionInitialLoad: Boolean(subscriptionsLoading && !subscriptions),
        subscriptionLoadError,
        subscriptionsLoading,
        subscriptionResources,
        subscriptionResourcesLoadError,
        subscriptionResourcesLoading,
        reloadSubscriptions,
        dispatch
    });

    return (
        <DataTest4Context.Provider value={contextValue}>{props.children}</DataTest4Context.Provider>
    );
});

export const connectDataTest4Component = createComponentConnector(DataTest4Context);
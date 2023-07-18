import * as React from "react";
import { Subscription } from "@microsoft/azureportal-reactview/Az";
import { createComponentConnector, useMemoizeObject, usePropertyBag } from "./Platform/dataManagement";
import { UseAsyncResult } from "./Platform/useAsync";
import { useSubscriptionResources, useSubscriptions } from "./Api/subscriptionHooks";
import { Resource } from "./Api/subscriptionApis";

export interface IDataTest4ViewProps {
    selectedSubscriptionId?: string;
};

export type IDataTest4Context = {
    initialSelectedSubscriptionId?: string;
    selectedSubscriptionId?: string;
    selectedSubscription?: Subscription;
    subscriptions?: UseAsyncResult<Subscription[]>;
    subscriptionsInitialLoad?: boolean;
    subscriptionResources?: UseAsyncResult<Resource[]>;
    dispatch: React.Dispatch<Partial<DataTest4State>>;
};

export type DataTest4State = {
    selectedSubscriptionId?: string;
}

const DataTest4Context = React.createContext<IDataTest4Context>({ dispatch: () => {} });

export const DataTest4ContextProvider = React.memo((props: React.PropsWithChildren<IDataTest4ViewProps>) => {
    const [bladeState, dispatch] = usePropertyBag<DataTest4State>({ selectedSubscriptionId: props.selectedSubscriptionId });

    const subscriptions = useSubscriptions();
    const subscriptionResources = useSubscriptionResources(bladeState.selectedSubscriptionId);

    const contextValue = useMemoizeObject({
        ...bladeState,
        initialSelectedSubscriptionId: props.selectedSubscriptionId,
        selectedSubscription: subscriptions.result?.find(s => s.subscriptionId === bladeState.selectedSubscriptionId),
        subscriptions,
        subscriptionsInitialLoad: Boolean(subscriptions.loading && !subscriptions.result),
        subscriptionResources,
        dispatch
    });

    return (
        <DataTest4Context.Provider value={contextValue}>{props.children}</DataTest4Context.Provider>
    );
});

export const dataTest4Connector = createComponentConnector(DataTest4Context);
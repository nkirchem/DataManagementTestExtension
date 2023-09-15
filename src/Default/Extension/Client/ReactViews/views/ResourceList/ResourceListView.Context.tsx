import * as React from "react";
import { Subscription } from "@microsoft/azureportal-reactview/Az";
import { ResourceGroup } from "@microsoft/azureportal-reactview/ResourceManagement";
import { createComponentConnector, UseAsyncResult, usePropertyBag } from "@microsoft/azureportal-reactview/DataManagement";
import { useSubscriptionResources, useUpdateResourceTagOperation } from "../../api/hooks/resourceHooks";
import { useSubscription } from "../../api/hooks/subscriptionHooks";
import { Resource } from "../../api/queries/resourceApis";

export type IResourceListViewContext = {
    selectedResource?: Resource;
    selectedResourceGroup?: ResourceGroup;
    subscriptionId: string;
    subscription?: Subscription;
    subscriptionResources?: UseAsyncResult<Resource[]>;
    updateTestTag: ReturnType<typeof useUpdateResourceTagOperation>;
    dispatch: React.Dispatch<Partial<ResourceListViewState>>;
};

export type ResourceListViewState = {
    selectedResourceId?: string;
    selectedResourceGroup?: ResourceGroup;
}

const ResourceListViewContext = React.createContext<IResourceListViewContext>(null);

export const ResourceListViewContextProvider = React.memo((props: React.PropsWithChildren<{ subscriptionId: string }>) => {
    const [bladeState, dispatch] = usePropertyBag<ResourceListViewState>({});

    const subscription = useSubscription(props.subscriptionId);
    const subscriptionResources = useSubscriptionResources(props.subscriptionId, bladeState.selectedResourceGroup?.name);

    const updateTestTag = useUpdateResourceTagOperation();

    const contextValue = {
        ...bladeState,
        selectedResource: subscriptionResources.result?.find(r => r.id === bladeState.selectedResourceId),
        subscriptionId: props.subscriptionId,
        subscription: subscription.result,
        subscriptionResources,
        updateTestTag,
        dispatch
    };

    return (
        <ResourceListViewContext.Provider value={contextValue}>{props.children}</ResourceListViewContext.Provider>
    );
});

export const resourceListViewConnector = createComponentConnector(ResourceListViewContext);
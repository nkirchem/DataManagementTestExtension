import * as React from "react";
import { Subscription } from "@microsoft/azureportal-reactview/Az";
import { ResourceGroup } from "@microsoft/azureportal-reactview/ResourceManagement";
import { createComponentConnector, UseAsyncResult, usePropertyBag } from "@microsoft/azureportal-reactview/DataManagement";
import { useResourcesByResourceGroup, useUpdateResourceTagOperation } from "../../api/hooks/resourceHooks";
import { useSubscription } from "../../api/hooks/subscriptionHooks";
import { Resource } from "../../api/queries/resourceQueries";
import { useResourceGroups } from "../../api/hooks/resourceGroupHooks";

export type IResourceListViewContext = {
    resources: UseAsyncResult<Resource[]>;
    resourceGroups: UseAsyncResult<ResourceGroup[]>;
    selectedResource?: Resource;
    selectedResourceGroup?: ResourceGroup;
    subscriptionId: string;
    subscription?: Subscription;
    updateTestTag: ReturnType<typeof useUpdateResourceTagOperation>;
    dispatch: React.Dispatch<Partial<ResourceListViewState>>;
};

export type ResourceListViewState = {
    selectedResourceId?: string;
    selectedResourceGroup?: ResourceGroup;
}

const ResourceListViewContext = React.createContext<IResourceListViewContext>(null);

export const ResourceListViewContextProvider = React.memo((props: React.PropsWithChildren<{ subscriptionId: string }>) => {
    const subscription = useSubscription(props.subscriptionId);
    const resourceGroups = useResourceGroups(props.subscriptionId);

    const [bladeState, dispatch] = usePropertyBag<ResourceListViewState>(() => ({
        selectedResourceGroup: resourceGroups.result && resourceGroups.result[0] 
    }));

    const resources = useResourcesByResourceGroup(props.subscriptionId, bladeState.selectedResourceGroup?.name);
    const updateTestTag = useUpdateResourceTagOperation(props.subscriptionId, bladeState.selectedResourceGroup?.name);

    const selectedResourceId = bladeState.selectedResourceId ?? resources.result?.[0]?.id;
    const selectedResource = resources.result?.find(r => r.id === selectedResourceId);

    const contextValue = {
        ...bladeState,
        resources,
        resourceGroups,
        selectedResource,
        subscriptionId: props.subscriptionId,
        subscription: subscription.result,
        updateTestTag,
        dispatch
    };

    return (
        <ResourceListViewContext.Provider value={contextValue}>{props.children}</ResourceListViewContext.Provider>
    );
});

export const resourceListViewConnector = createComponentConnector(ResourceListViewContext);
import { useAsyncWithContext, UseAsyncResult, useOperation } from "@microsoft/azureportal-reactview/DataManagement";
import { getSubscriptionResources, Resource, updateResourceTestTag } from "../queries/resourceApis";

export function useSubscriptionResources(subscriptionId: string, resourceGroup?: string): UseAsyncResult<Resource[]> {
  return useAsyncWithContext(
    ({ refreshing }) => getSubscriptionResources(subscriptionId, resourceGroup, { bypassCache: refreshing }),
    [subscriptionId, resourceGroup],
    { disabled: !resourceGroup }
  );
}

export function useUpdateResourceTagOperation() {
  return useOperation(async (resourceId: string, testTagValue: string) => {
    const result = await updateResourceTestTag(resourceId, testTagValue);
    return result;
  });
};
import { useOperation } from "@microsoft/azureportal-reactview/DataManagement";
import { resourcesByResourceGroupQuery, updateResourceTestTag } from "../queries/resourceQueries";
import { useQuery } from "@microsoft/azureportal-reactview/QueryCache";

export function useResourcesByResourceGroup(subscriptionId: string, resourceGroup?: string) {
  return useQuery(resourcesByResourceGroupQuery, [subscriptionId, resourceGroup], { disabled: !resourceGroup });
}

export function useUpdateResourceTagOperation(subscriptionId: string, resourceGroup?: string) {
  return useOperation(async (resourceId: string, testTagValue: string) => {
    try {
      await updateResourceTestTag(resourceId, testTagValue);
    } catch (error) {
      if (error.httpStatusCode === 405) {
        // Localhost error, let's pretend like it worked
      } else {
        throw error;
      }
    }
    const resourceListQuery = resourcesByResourceGroupQuery.query(subscriptionId, resourceGroup);
    const cachedListValue = resourceListQuery.getCachedValue();
    if (cachedListValue?.value) {
      resourceListQuery.set(
        cachedListValue.value.map((resource) =>
          resource.id === resourceId ? { ...resource, tags: { test: testTagValue } } : resource
        )
      );
    }
  });
}
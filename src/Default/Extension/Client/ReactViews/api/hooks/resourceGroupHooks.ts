import { useQuery } from "@microsoft/azureportal-reactview/DataManagement";
import { resourceGroupsQuery } from "../queries/resourceGroupQueries";

export function useResourceGroups(subscriptionId: string) {
  return useQuery(resourceGroupsQuery, [subscriptionId]);
}

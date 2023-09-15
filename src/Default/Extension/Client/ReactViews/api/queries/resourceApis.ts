import { batch, RequestOptions } from "@microsoft/azureportal-reactview/Ajax";
import { getOrAdd, clearItem } from "@microsoft/azureportal-reactview/DataCache";

export interface Resource {
  id: string;
  location: string;
  name: string;
  tags?: Record<string, string>;
  type: string;
}

export interface IGetSubscriptionResourceOptions {
  bypassCache?: boolean;
}

export async function getSubscriptionResources(
  subscriptionId: string,
  resourceGroup: string,
  options: IGetSubscriptionResourceOptions = {}
): Promise<Resource[]> {
  const { bypassCache } = options;
  const cacheKey = `subscription-resources-${subscriptionId}-${resourceGroup}`;
  if (bypassCache) {
    clearItem(cacheKey);
  }
  return getOrAdd(cacheKey, () => {
    return batch<{ value: Resource[] }>({
      uri: `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/resources?api-version=2019-08-01&$top=100`,
      options: RequestOptions.DebounceImmediately,
    }).then((response) => {
      const subscriptions = response.content.value || [];
      subscriptions.sort((a, b) => a.name.localeCompare(b.name));
      return subscriptions;
    });
  });
}

export async function updateResourceTestTag(resourceId: string, testTagValue: string): Promise<Resource> {
  return batch<Resource>({
    uri: `${resourceId}/providers/Microsoft.Resources/tags/default?api-version=2021-04-01`,
    type: "PUT",
    options: RequestOptions.DebounceImmediately,
    content: { properties: { tags: { test: testTagValue } } },
  }).then(response => response.content);
}

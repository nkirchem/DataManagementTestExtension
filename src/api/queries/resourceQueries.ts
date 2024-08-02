import { batch, RequestOptions } from "@microsoft/azureportal-reactview/Ajax";
import { registerQuery } from "@microsoft/azureportal-reactview/QueryRegistration";

export interface Resource {
  id: string;
  location: string;
  name: string;
  tags?: Record<string, string>;
  type: string;
}

export const resourcesByResourceGroupQuery = registerQuery({
    name: "resourcesByResourceGroup",
    query: async (subscriptionId: string, resourceGroup: string) => {
        return batch<{ value: Resource[] }>({
            setTelemetryHeader: "resourcesByResourceGroup",
            uri: `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/resources?api-version=2019-08-01&$top=100`,
            options: RequestOptions.DebounceImmediately,
          }).then((response) => {
            const subscriptions = response.content.value || [];
            subscriptions.sort((a, b) => a.name.localeCompare(b.name));
            return subscriptions;
          });
    },
});

export async function updateResourceTestTag(resourceId: string, testTagValue: string): Promise<Resource> {
  return batch<Resource>({
    uri: `${resourceId}/providers/Microsoft.Resources/tags/default?api-version=2021-04-01`,
    type: "PUT",
    options: RequestOptions.DebounceImmediately,
    content: { properties: { tags: { test: testTagValue } } },
  }).then(response => response.content);
}

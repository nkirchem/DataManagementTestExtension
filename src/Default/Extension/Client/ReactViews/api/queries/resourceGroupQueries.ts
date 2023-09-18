import { batch, RequestOptions } from "@microsoft/azureportal-reactview/Ajax";
import { registerQuery } from "@microsoft/azureportal-reactview/QueryCache";
import { ResourceGroup } from "@microsoft/azureportal-reactview/ResourceManagement";

export const resourceGroupsQuery = registerQuery({
    name: "resourceGroups",
    query: async (subscriptionId: string) => {
        return batch<{ value: ResourceGroup[] }>({
            setTelemetryHeader: "resourceGroups",
            uri: `/subscriptions/${subscriptionId}/resourceGroups?api-version=2019-08-01&$top=100`,
            options: RequestOptions.DebounceImmediately,
          }).then((response) => {
            const subscriptions = response.content.value || [];
            subscriptions.sort((a, b) => a.name.localeCompare(b.name));
            return subscriptions;
          });
    },
});

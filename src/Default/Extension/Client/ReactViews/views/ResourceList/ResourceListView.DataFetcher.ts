import { IResourceListViewProps } from "./ResourceListView.types";
import { subscriptionQuery } from "../../api/queries/subscriptionQueries";
import { resourceGroupsQuery } from "../../api/queries/resourceGroupQueries";
import { resourcesByResourceGroupQuery } from "../../api/queries/resourceQueries";

export function fetchData(props: IResourceListViewProps) {
    const subscriptionId = props.parameters.subscriptionId;
    subscriptionQuery.bind(subscriptionId).get();

    resourceGroupsQuery.bind(subscriptionId).get().then(resourceGroups => {
        if (resourceGroups.length) {
            resourcesByResourceGroupQuery.bind(subscriptionId, resourceGroups[0].name).get();
        }
    });
}

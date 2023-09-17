import { IResourceListViewProps } from "./ResourceListView.types";
import { subscriptionQuery } from "../../api/queries/subscriptionQueries";
import { resourceGroupsQuery } from "../../api/queries/resourceGroupQueries";
import { resourcesByResourceGroupQuery } from "../../api/queries/resourceQueries";

export function fetchData(props: IResourceListViewProps){
    const subscriptionId = props.parameters.subscriptionId;
    subscriptionQuery.query(subscriptionId).get();

    resourceGroupsQuery.query(subscriptionId).get().then(resourceGroups => {
        if (resourceGroups.length) {
            resourcesByResourceGroupQuery.query(subscriptionId, resourceGroups[0].id).get();
        }
    });
}

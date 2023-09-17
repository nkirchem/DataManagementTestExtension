import { IResourceListViewProps } from "./ResourceListView.types";
import { subscriptionQuery } from "../../api/queries/subscriptionQueries";
import { resourceGroupsQuery } from "../../api/queries/resourceGroupQueries";

export function fetchData(props: IResourceListViewProps){
    subscriptionQuery.query(props.parameters.subscriptionId).forceGet();
    resourceGroupsQuery.query(props.parameters.subscriptionId).forceGet();
}

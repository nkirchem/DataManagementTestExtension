import { IResourceListViewProps } from "./ResourceListView.types";
import { subscriptionQuery } from "../../api/queries/subscriptionQueries";

export function fetchData(props: IResourceListViewProps){
    subscriptionQuery.query(props.parameters.subscriptionId).forceGet();
}

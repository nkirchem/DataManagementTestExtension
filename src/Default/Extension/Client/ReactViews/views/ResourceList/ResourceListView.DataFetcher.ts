import { IResourceListViewProps } from "./ResourceListView.types";
import { getSubscription } from "../../api/queries/subscriptionApis";

export function fetchData(props: IResourceListViewProps){
    getSubscription(props.parameters.subscriptionId);
}

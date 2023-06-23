import { IDataTestViewProps } from "./DataTest.types";
import { getSubscriptionResources, getSubscriptions } from "./Api/subscriptionApis";

export function fetchData(props: IDataTestViewProps){
    getSubscriptions();
    if (props.parameters.selectedSubscriptionId) {
        getSubscriptionResources(props.parameters.selectedSubscriptionId);
    }
}

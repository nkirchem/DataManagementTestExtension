import { getSubscriptions } from "../../api/queries/subscriptionApis";

export function fetchData() {
    getSubscriptions();
}

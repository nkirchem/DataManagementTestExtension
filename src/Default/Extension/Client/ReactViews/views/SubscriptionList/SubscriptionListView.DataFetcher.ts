import { subscriptionsQuery } from "../../api/queries/subscriptionQueries";

export function fetchData() {
    subscriptionsQuery.bind().get();
}

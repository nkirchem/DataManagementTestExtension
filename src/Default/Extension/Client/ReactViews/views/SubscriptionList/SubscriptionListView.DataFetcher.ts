import { subscriptionsQuery } from "../../api/queries/subscriptionQueries";

export function fetchData() {
    subscriptionsQuery.query().get();
}

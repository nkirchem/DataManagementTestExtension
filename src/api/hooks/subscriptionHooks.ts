import { subscriptionQuery, subscriptionsQuery } from "../queries/subscriptionQueries";
import { useQuery } from "@microsoft/azureportal-reactview/DataManagement";

export function useSubscriptions() {
  return useQuery(subscriptionsQuery, []);
}

export function useSubscription(subscriptionId: string) {
  return useQuery(subscriptionQuery, [subscriptionId]);
}
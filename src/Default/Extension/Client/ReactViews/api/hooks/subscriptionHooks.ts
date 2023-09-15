import { Subscription } from "@microsoft/azureportal-reactview/Az";
import { useAsyncWithContext, UseAsyncResult } from "@microsoft/azureportal-reactview/DataManagement";
import { getSubscription, getSubscriptions, IGetSubscriptionOptions } from "../queries/subscriptionApis";

export function useSubscriptions(options: IGetSubscriptionOptions = {}): UseAsyncResult<Subscription[]> {
  return useAsyncWithContext(
    ({ refreshing }) => getSubscriptions({ ...options, bypassCache: options.bypassCache || refreshing }),
    []
  );
}

export function useSubscription(subscriptionId: string, options: IGetSubscriptionOptions = {}): UseAsyncResult<Subscription> {
  return useAsyncWithContext(
    ({ refreshing }) => getSubscription(subscriptionId, { ...options, bypassCache: options.bypassCache || refreshing }),
    [subscriptionId]
  );
}
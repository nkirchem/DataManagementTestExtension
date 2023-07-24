import { Subscription } from "@microsoft/azureportal-reactview/Az";
import { useAsyncWithContext, UseAsyncResult } from "../Platform/useAsync";
import { getSubscriptionResources, getSubscriptions, IGetSubscriptionOptions, Resource } from "./subscriptionApis";

export function useSubscriptions(options: IGetSubscriptionOptions = {}): UseAsyncResult<Subscription[]> {
  return useAsyncWithContext(
    ({ updating }) => getSubscriptions({ ...options, bypassCache: options.bypassCache || updating }),
    []
  );
}

export function useSubscriptionResources(subscriptionId: string): UseAsyncResult<Resource[]> {
  return useAsyncWithContext(
    ({ updating }) => getSubscriptionResources(subscriptionId, { bypassCache: updating }),
    [subscriptionId],
    { disabled: !subscriptionId }
  );
}

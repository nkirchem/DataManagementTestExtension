import { Subscription } from "@microsoft/azureportal-reactview/Az";
import { useAsyncWithContext, UseAsyncResult } from "../Platform/useAsync";
import { getSubscriptionResources, getSubscriptions, IGetSubscriptionOptions, Resource } from "./subscriptionApis";

export function useSubscriptions(options: IGetSubscriptionOptions = {}): UseAsyncResult<Subscription[]> {
  return useAsyncWithContext(
    ({ refreshing }) => getSubscriptions({ ...options, bypassCache: options.bypassCache || refreshing }),
    []
  );
}

export function useSubscriptionResources(subscriptionId: string): UseAsyncResult<Resource[]> {
  return useAsyncWithContext(
    ({ refreshing }) => getSubscriptionResources(subscriptionId, { bypassCache: refreshing }),
    [subscriptionId],
    { disabled: !subscriptionId }
  );
}

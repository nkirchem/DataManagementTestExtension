import { RequestOptions, batch } from "@microsoft/azureportal-reactview/Ajax";
import { Subscription } from "@microsoft/azureportal-reactview/Az";
import { getOrAdd, clearItem } from "@microsoft/azureportal-reactview/DataCache";

export interface IGetSubscriptionOptions {
    bypassCache?: boolean;
}

export async function getSubscriptions(options: IGetSubscriptionOptions = {}): Promise<Subscription[]> {
    const { bypassCache } = options;
    const cacheKey = "subscriptions-all";
    if (bypassCache) {
        clearItem(cacheKey);
    }
    return getOrAdd(cacheKey, () => {
        return batch<{ value: Subscription[] }>({ uri: "/subscriptions?api-version=2019-08-01", options: RequestOptions.DebounceImmediately }).then(response => {
            const subscriptions = response.content.value || [];
            subscriptions.sort((a, b) => a.displayName.localeCompare(b.displayName));
            return subscriptions;
        });
    });
}

export async function getSubscription(subscriptionId: string, options: IGetSubscriptionOptions = {}): Promise<Subscription> {
    const { bypassCache } = options;
    const cacheKey = `$subscription-${subscriptionId}`;
    if (bypassCache) {
        clearItem(cacheKey);
    }
    return getOrAdd(cacheKey, () => {
        return batch<Subscription>({ uri: `/subscriptions/${subscriptionId}?api-version=2019-08-01`, options: RequestOptions.DebounceImmediately }).then(response => response.content);
    });
}
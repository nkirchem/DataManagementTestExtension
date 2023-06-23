import { batch } from "@microsoft/azureportal-reactview/Ajax";
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
        return batch<{ value: Subscription[] }>({ uri: "/subscriptions?api-version=2019-08-01" }).then(response => {
            const subscriptions = response.content.value || [];
            subscriptions.sort((a, b) => a.displayName.localeCompare(b.displayName));
            return subscriptions;
        });    
    });
}

export interface Resource {
    id: string;
    location: string;
    name: string;
    type: string;
}

export interface IGetSubscriptionResourceOptions {
    bypassCache?: boolean;
}

export async function getSubscriptionResources(subscriptionId: string, options: IGetSubscriptionResourceOptions = {}): Promise<Resource[]> {
    const { bypassCache } = options;
    const cacheKey = `subscription-resources-${subscriptionId}`;
    if (bypassCache) {
        clearItem(cacheKey);
    }
    return getOrAdd(cacheKey, () => {
        return batch<{ value: Resource[] }>({ uri: `/subscriptions/${subscriptionId}/resources?api-version=2019-08-01` }).then(response => {
            const subscriptions = response.content.value || [];
            subscriptions.sort((a, b) => a.name.localeCompare(b.name));
            return subscriptions;
        });    
    });
}

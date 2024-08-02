import { RequestOptions, batch } from "@microsoft/azureportal-reactview/Ajax";
import { Subscription } from "@microsoft/azureportal-reactview/Az";
import { registerQuery } from "@microsoft/azureportal-reactview/QueryRegistration";

export const subscriptionQuery = registerQuery({
  name: "subscription",
  query: async (subscriptionId: string) =>
    batch<Subscription>({
      setTelemetryHeader: "subscription",
      uri: `/subscriptions/${subscriptionId}?api-version=2019-08-01`,
      options: RequestOptions.DebounceImmediately,
    }).then((response) => response.content),
});

export const subscriptionsQuery = registerQuery({
  name: "subscriptions",
  query: async () =>
    batch<{ value: Subscription[] }>({
      setTelemetryHeader: "subscriptions",
      uri: "/subscriptions?api-version=2019-08-01",
      options: RequestOptions.DebounceImmediately,
    }).then((response) => {
      const subscriptions = response.content.value || [];
      subscriptions.sort((a, b) => a.displayName.localeCompare(b.displayName));
      return subscriptions;
    }),
  onSuccess: (_, subscriptions) => {
    for (const subscription of subscriptions) {
      subscriptionQuery.bind(subscription.subscriptionId).set(subscription);
    }
  }
});

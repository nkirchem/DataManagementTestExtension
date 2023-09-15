import { setTitle } from "@microsoft/azureportal-reactview/Az";
import * as React from "react";
import { useSubscriptions } from "../../api/hooks/subscriptionHooks";
import { SubscriptionList } from "./Components/SubscriptionList";
import { SubscriptionCommandBar } from "./Components/SubscriptionCommandBar";

setTitle("Subscriptions");

const SubscriptionListView: React.FC = () => {
    console.log(`Render SubscriptionListView`);

    const { inProgress, loading, result: subscriptions, refresh } = useSubscriptions();
    return <div>
        <SubscriptionCommandBar loading={inProgress} refresh={refresh} />
        <SubscriptionList loading={loading} subscriptions={subscriptions} />
    </div>
};

export default SubscriptionListView;

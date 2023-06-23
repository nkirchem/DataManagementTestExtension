import { NavHeader } from "./Components/NavHeader";
import * as React from "react";
import { useSubscriptions } from "./Api/subscriptionHooks";
import { SubscriptionList } from "./Components/SubscriptionList";
import { SubscriptionCommandBar } from "./Components/SubscriptionCommandBar";

const DataTest: React.FC = () => {
    console.log(`Render DataTest1.ReactView`);

    const { loading, refresh, result: subscriptions } = useSubscriptions({ bypassCache: true });
    return <div>
        <NavHeader currentViewName="DataTest1.ReactView" />
        <SubscriptionCommandBar loading={loading} refresh={refresh} />
        <SubscriptionList loading={loading && !subscriptions} subscriptions={subscriptions} />
    </div>
};

export default DataTest;

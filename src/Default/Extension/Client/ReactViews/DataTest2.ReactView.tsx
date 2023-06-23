import { NavHeader } from "./Components/NavHeader";
import * as React from "react";
import { useSubscriptions } from "./Api/subscriptionHooks";
import { SubscriptionList } from "./Components/SubscriptionList";
import { SubscriptionCommandBar } from "./Components/SubscriptionCommandBar";

const DataTest: React.FC = () => {
    console.log(`Render DataTest2.ReactView`);

    const { loading, refresh, result: subscriptions } = useSubscriptions();
    return <div>
        <NavHeader currentViewName="DataTest2.ReactView" />
        <SubscriptionCommandBar loading={loading} refresh={refresh} />
        <SubscriptionList loading={loading && !subscriptions} subscriptions={subscriptions} />
    </div>
};

export default DataTest;

import { NavHeader } from "./Components/NavHeader";
import * as React from "react";
import { useSubscriptions } from "./Api/subscriptionHooks";
import { SubscriptionList } from "./Components/SubscriptionList";
import { SubscriptionCommandBar } from "./Components/SubscriptionCommandBar";
import { withForExport } from "@microsoft/azureportal-reactview/ReactView";

const DataTest: React.FC = () => {
    console.log(`Render DataTest1.ReactView`);

    const { inProgress, loading, result: subscriptions, refresh } = useSubscriptions({ bypassCache: true });
    return <div>
        <NavHeader currentViewName="DataTest1.ReactView" />
        <SubscriptionCommandBar loading={inProgress} refresh={refresh} />
        <SubscriptionList loading={loading} subscriptions={subscriptions} />
    </div>
};

export default withForExport(DataTest);

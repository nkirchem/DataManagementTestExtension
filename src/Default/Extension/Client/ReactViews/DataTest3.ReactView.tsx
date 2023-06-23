import * as React from "react";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import { useSubscriptionResources, useSubscriptions } from "./Api/subscriptionHooks";
import { NavHeader } from "./Components/NavHeader";
import { SubscriptionList } from "./Components/SubscriptionList";
import { SubscriptionDetails } from "./Components/SubscriptionDetails";
import { SubscriptionCommandBar } from "./Components/SubscriptionCommandBar";
import { IDataTestViewProps } from "./DataTest.types";

const DataTest: React.FC<IDataTestViewProps> = props => {
    console.log(`Render DataTest3.ReactView - ${props.parameters.selectedSubscriptionId}`);

    const [selectedSubscriptionId, setSelectedSubscriptionId] = React.useState(props.parameters.selectedSubscriptionId);
    const { loading, refresh, result: subscriptions } = useSubscriptions();
    const selectedSubcription = subscriptions?.find(s => s.subscriptionId === selectedSubscriptionId);
    const { result: subscriptionResources, loading: subscriptionResourcesLoading } = useSubscriptionResources(selectedSubscriptionId);

    return <div>
        <NavHeader currentViewName="DataTest3.ReactView" currentSubscriptionId={selectedSubscriptionId} />
        <SubscriptionCommandBar loading={loading} refresh={refresh} />
        <div className={mergeStyles({ display: "flex", flexDirection: "row" })}>
            <div className={mergeStyles({ width: "50%" })}>
                <SubscriptionList initialSelectedSubscriptionId={props.parameters.selectedSubscriptionId} loading={loading} onSelectionChanged={setSelectedSubscriptionId} subscriptions={subscriptions} />
            </div>
            <div className={mergeStyles({ width: "50%", padding: "0 20px" })}>
                <SubscriptionDetails subscription={selectedSubcription} subscriptionResources={subscriptionResources} subscriptionResourcesLoading={subscriptionResourcesLoading && !subscriptionResources} />
            </div>
        </div>
    </div>
};

export default DataTest;

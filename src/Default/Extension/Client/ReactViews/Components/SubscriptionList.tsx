import { Selection, SelectionMode, ShimmeredDetailsList } from "@fluentui/react";
import { Subscription } from "@microsoft/azureportal-reactview/Az";
import * as React from "react";

export interface ISubscriptionListProps {
  loading?: boolean;
  initialSelectedSubscriptionId?: string;
  subscriptions?: Subscription[];
  onSelectionChanged?: (subscriptionId?: string) => void;
}

export const SubscriptionList: React.FC<ISubscriptionListProps> = (props) => {
  console.log(`Render SubscriptionList`);

  const { initialSelectedSubscriptionId, loading, onSelectionChanged, subscriptions } = props;
  const performedInitialSelection = React.useRef(false);
  const selectionRef = React.useRef<Selection>();

  if (!selectionRef.current && onSelectionChanged) {
    selectionRef.current = new Selection({
      onSelectionChanged: () => {
        const subscriptionId = (selectionRef.current?.getSelection()[0] as Subscription)?.subscriptionId;
        onSelectionChanged(subscriptionId);
      },
      getKey: item => (item as Subscription)?.subscriptionId,
      selectionMode: SelectionMode.single
    })
  }

  React.useEffect(() => {
    if (!performedInitialSelection.current && initialSelectedSubscriptionId && subscriptions) {
      performedInitialSelection.current = true;
      selectionRef.current?.setKeySelected(initialSelectedSubscriptionId, true, false);
    }
  }, [subscriptions]);

  return (
    <div>
      <ShimmeredDetailsList
        columns={[
          {
            key: "name",
            name: "Name",
            minWidth: 250,
            onRender: (item) => item.displayName,
          },
          {
            key: "state",
            name: "State",
            minWidth: 100,
            onRender: (item) => item.state,
          },
          {
            key: "id",
            name: "Subscription ID",
            minWidth: 260,
            onRender: (item) => item.subscriptionId,
          },
        ]}
        enableShimmer={loading}
        items={subscriptions?.slice(0, 15) || []}
        selection={selectionRef.current}
        selectionMode={selectionRef.current ? SelectionMode.single : SelectionMode.none}
        setKey="set"
        getKey={item => item?.subscriptionId}
      />
    </div>
  );
};

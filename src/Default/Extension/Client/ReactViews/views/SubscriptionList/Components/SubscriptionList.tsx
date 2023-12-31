import { SearchBox, SelectionMode, ShimmeredDetailsList } from "@fluentui/react";
import { useAsync } from "@fluentui/react-hooks";
import { Subscription } from "@microsoft/azureportal-reactview/Az";
import { BladeLink } from "@microsoft/azureportal-reactview/BladeLink";
import * as React from "react";

export interface ISubscriptionListProps {
  loading?: boolean;
  subscriptions?: Subscription[];
}

export const SubscriptionList: React.FC<ISubscriptionListProps> = (props) => {
  console.log(`Render SubscriptionList`);
  const { loading, subscriptions } = props;
  const [filterText, setFilterText] = React.useState("");
  const fluentAsync = useAsync();

  const onSearchChanged = React.useMemo(() => {
    return fluentAsync.debounce((_ev: React.ChangeEvent<HTMLInputElement>, newValue?: string) => {
      setFilterText(newValue || "");
    }, 200);
  }, []);

  const filteredItems = React.useMemo(() => {
    return filterText ? subscriptions.filter(s => s.displayName.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) >= 0) : subscriptions;
  }, [filterText, subscriptions]);

  return (
    <div>
      <SearchBox placeholder="Filter subscriptions by name" onChange={onSearchChanged} />
      <ShimmeredDetailsList
        columns={[
          {
            key: "name",
            name: "Name",
            minWidth: 250,
            onRender: (item: Subscription) => (
              <BladeLink
                bladeReference={{
                  bladeName: "ResourceListView.ReactView",
                  extensionName: "DataManagementTest",
                  parameters: { subscriptionId: item.subscriptionId },
                }}
              >
                {item.displayName}
              </BladeLink>
            ),
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
        items={filteredItems}
        selectionMode={SelectionMode.none}
      />
    </div>
  );
};

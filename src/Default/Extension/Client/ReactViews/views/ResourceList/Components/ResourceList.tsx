import { Selection, SelectionMode, ShimmeredDetailsList, mergeStyles } from "@fluentui/react";
import { ResourceGroupDropdown } from "@microsoft/azureportal-reactview/ResourceGroupDropdown";
import * as React from "react";
import { resourceListViewConnector } from "../ResourceListView.Context";
import { Resource } from "../../../api/queries/resourceApis";

export const ResourceList = resourceListViewConnector.connect(
  (ctx) => ({
    selectedResourceGroup: ctx.selectedResourceGroup,
    subscriptionId: ctx.subscriptionId,
    subscriptionResources: ctx.subscriptionResources?.result,
    subscriptionResourcesLoading: ctx.subscriptionResources?.loading,
    dispatch: ctx.dispatch,
  }),
  (props) => {
    console.log(`Render ResourceList`);

    const { dispatch, selectedResourceGroup, subscriptionId, subscriptionResources, subscriptionResourcesLoading } =
      props;
    const selectionRef = React.useRef<Selection>();

    if (!selectionRef.current) {
      selectionRef.current = new Selection({
        onSelectionChanged: () => {
          const selectedResourceId = (selectionRef.current?.getSelection()[0] as Resource)?.id;
          if (selectedResourceId) {
            dispatch({ selectedResourceId });
          }
        },
        getKey: (item) => (item as Resource)?.id,
        selectionMode: SelectionMode.single,
      });
    }

    const performedInitialSelection = React.useRef(false);
    React.useEffect(() => {
      if (!performedInitialSelection.current && subscriptionResources?.length > 0) {
        performedInitialSelection.current = true;
        selectionRef.current?.setKeySelected(subscriptionResources[0].id, true, false);
      }
    }, [subscriptionResources]);

    return (
      <div>
        <h4 className={mergeStyles({ marginTop: "40px" })}>Subscription resource groups:</h4>
        <ResourceGroupDropdown
          subscriptionId={subscriptionId}
          selectedResourceGroupId={selectedResourceGroup?.id}
          onChange={(_ev, selectedResourceGroup) => dispatch({ selectedResourceGroup })}
        />
        {selectedResourceGroup ? (
          <div>
            <h4 className={mergeStyles({ marginTop: "40px" })}>Subscription resources:</h4>
            {subscriptionResourcesLoading || subscriptionResources?.length > 0 ? (
              <ShimmeredDetailsList
                columns={[
                  {
                    key: "name",
                    name: "Name",
                    minWidth: 250,
                    isResizable: true,
                    onRender: (item) => item.name,
                  },
                  {
                    key: "type",
                    name: "Type",
                    minWidth: 200,
                    isResizable: true,
                    onRender: (item) => item.type,
                  },
                  {
                    key: "location",
                    name: "Location",
                    minWidth: 120,
                    isResizable: true,
                    onRender: (item) => item.location,
                  },
                  {
                    key: "testTag",
                    name: "Test Tag",
                    minWidth: 100,
                    isResizable: true,
                    onRender: (item) => item.tags?.test,
                  },
                ]}
                enableShimmer={subscriptionResourcesLoading}
                items={subscriptionResources?.slice(0, 12) || []}
                selection={selectionRef.current}
                selectionMode={SelectionMode.single}
                setKey="set"
                getKey={(item) => item?.id}
              />
            ) : (
              <div>No resources found in this resource group.</div>
            )}
          </div>
        ) : (
          <div className={mergeStyles({ marginTop: 20 })}>Select a resource group to view its resources.</div>
        )}
      </div>
    );
  }
);

import { Selection, SelectionMode, ShimmeredDetailsList, mergeStyles } from "@fluentui/react";
import * as React from "react";
import { ResourceGroupDropdown } from "./ResourceGroupDropdown";
import { resourceListViewConnector } from "../ResourceListView.Context";
import { Resource } from "../../../api/queries/resourceQueries";

export const ResourceList = resourceListViewConnector.connect(
  (ctx) => ({
    selectedResourceGroup: ctx.selectedResourceGroup,
    selectedResource: ctx.selectedResource,
    subscriptionResources: ctx.resources?.result,
    subscriptionResourcesLoading: ctx.resources?.loading,
    dispatch: ctx.dispatch,
  }),
  (props) => {
    console.log(`Render ResourceList`);

    const { dispatch, selectedResource, selectedResourceGroup, subscriptionResources, subscriptionResourcesLoading } = props;
    const selectionRef = React.useRef<Selection>();
    const hasResources = subscriptionResources?.length > 0;
    const listItems = subscriptionResources || [];

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
      selectionRef.current.setItems(listItems as any[], true);
    }

    if (selectedResource) {
      selectionRef.current.setKeySelected(selectedResource.id, true, false);
    }

    return (
      <div>
        <h4 className={mergeStyles({ marginTop: "40px" })}>Subscription resource groups:</h4>
        <ResourceGroupDropdown />
        {selectedResourceGroup ? (
          <div>
            <h4 className={mergeStyles({ marginTop: "40px" })}>Subscription resources:</h4>
            {(subscriptionResourcesLoading || hasResources) ? (
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
                enableShimmer={!hasResources}
                items={listItems}
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

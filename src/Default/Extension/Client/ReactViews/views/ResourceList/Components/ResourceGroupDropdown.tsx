import { FilterableDropdown } from "@microsoft/azureportal-reactview/FilterableDropdown";
import * as React from "react";
import { resourceListViewConnector } from "../ResourceListView.Context";
import { Shimmer } from "@fluentui/react";

export const ResourceGroupDropdown = resourceListViewConnector.connect(
  (ctx) => ({
    dispatch: ctx.dispatch,
    resourceGroups: ctx.resourceGroups.result,
    loading: ctx.resourceGroups.loading,
    selectedResourceGroup: ctx.selectedResourceGroup,
  }),
  (props) => {
    console.log(`Render ResourceGroupDropdown`);

    const { dispatch, loading, resourceGroups, selectedResourceGroup } = props;
    return (
      <Shimmer isDataLoaded={!loading}>
        <FilterableDropdown
          options={resourceGroups?.map((rg) => ({ key: rg.id, text: rg.name, data: rg })) || []}
          selectedKey={selectedResourceGroup?.id}
          onChange={(_ev, item) => {
            dispatch({ selectedResourceGroup: item.data });
          }}
        />
      </Shimmer>
    );
  }
);

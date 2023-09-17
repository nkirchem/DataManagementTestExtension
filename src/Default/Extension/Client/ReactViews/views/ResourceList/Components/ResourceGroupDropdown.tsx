import { FilterableDropdown } from "@microsoft/azureportal-reactview/FilterableDropdown";
import * as React from "react";
import { resourceListViewConnector } from "../ResourceListView.Context";
import { Shimmer } from "@fluentui/react";

export const ResourceGroupDropdown = resourceListViewConnector.connect(
  (ctx) => ({
    resourceGroups: ctx.resourceGroups.result,
    loading: ctx.resourceGroups.loading,
    selectedResourceGroup: ctx.selectedResourceGroup,
  }),
  (props) => {
    console.log(`Render ResourceGroupDropdown`);

    const { loading, resourceGroups, selectedResourceGroup } = props;
    return (
      <Shimmer isDataLoaded={!loading}>
        <FilterableDropdown
          options={resourceGroups?.map((rg) => ({ key: rg.id, text: rg.name })) || []}
          selectedKey={selectedResourceGroup?.id}
        />
      </Shimmer>
    );
  }
);

import { openContextPane } from "@microsoft/azureportal-reactview/Az";
import { DefaultButton, mergeStyles } from "@fluentui/react";
import * as React from "react";
import { resourceListViewConnector } from "../ResourceListView.Context";

export const ResourceDetails = resourceListViewConnector.connectContextProps(
  ["selectedResource", "updateTestTag", "subscriptionId", "selectedResourceGroup"],
  (props) => {
    console.log(`Render ResourceDetails`);

    const { selectedResource, updateTestTag, subscriptionId, selectedResourceGroup } = props;
    return (
      <div className={mergeStyles({ margin: "20px 0", minHeight: "36px" })}>
        {!selectedResource ? (
          <div>Select a resource to view its details...</div>
        ) : (
          <div>
            <div className={mergeStyles({ fontWeight: "bold" })}>{selectedResource.name}</div>
            <div className={mergeStyles({ color: "#888" })}>Id: {selectedResource.id}</div>
            <div className={mergeStyles({ color: "#888" })}>Location: {selectedResource.location}</div>
            <div className={mergeStyles({ color: "#888" })}>Type: {selectedResource.type}</div>
            <div className={mergeStyles({ color: "#888" })}>Tags: {JSON.stringify(selectedResource.tags)}</div>

            <div className={mergeStyles({ fontWeight: "bold", marginTop: 40 })}>Test Tag:</div>
            <div className={mergeStyles({ color: "#888" })}>{selectedResource.tags?.test ?? "<none>"}</div>
            <DefaultButton
              className={mergeStyles({ marginTop: 10, marginRight: 10 })}
              disabled={updateTestTag.inProgress}
              text="Set random test tag"
              onClick={() => {
                const newTagValue = btoa(Math.random().toString().substring(2));
                updateTestTag.execute(selectedResource.id, newTagValue);
              }}
            />
            <DefaultButton
              className={mergeStyles({ marginTop: 10 })}
              disabled={updateTestTag.inProgress}
              text="Edit test tag in editor pane"
              onClick={() => {
                openContextPane({
                  bladeName: "TestTagEditorView.ReactView",
                  extensionName: "DataManagementTest",
                  parameters: {
                    resourceId: selectedResource.id,
                    initialTestTagValue: selectedResource.tags?.test,
                    subscriptionId,
                    resourceGroupName: selectedResourceGroup?.name,
                  },
                });
              }}
            />
          </div>
        )}
      </div>
    );
  }
);

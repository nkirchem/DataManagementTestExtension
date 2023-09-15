import { CommandBar } from "@microsoft/azureportal-reactview/CommandBar";
import * as React from "react";
import { resourceListViewConnector } from "../ResourceListView.Context";

export interface IResourceCommandBarProps {
  loading?: boolean;
  refresh?: () => void;
}

export const ResourceCommandBar = resourceListViewConnector.connect(
  (ctx) => ({ loading: ctx.subscriptionResources?.inProgress, refresh: ctx.subscriptionResources?.refresh }),
  (props) => {
    console.log(`Render ResourceCommandBar`);

    const { loading, refresh } = props;
    return (
      <div>
        {refresh && (
          <CommandBar
            items={[
              {
                key: "refresh",
                disabled: loading,
                onClick: () => {
                  refresh();
                },
                name: loading ? "Loading..." : "Refresh",
              },
            ]}
          />
        )}
      </div>
    );
  }
);

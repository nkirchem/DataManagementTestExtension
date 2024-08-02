import { CommandBar } from "@microsoft/azureportal-reactview/CommandBar";
import * as React from "react";

export interface ISubscriptionCommandBarProps {
  loading?: boolean;
  refresh?: () => void;
}

export const SubscriptionCommandBar: React.FC<ISubscriptionCommandBarProps> = (
  props
) => {
  console.log(`Render SubscriptionCommandBar`);

  const { loading, refresh } = props;
  return (
    <div>
      {refresh && <CommandBar
          items={[
            {
              key: "refresh",
              disabled: loading,
              onClick: () => refresh(),
              name: loading ? "Loading..." : "Refresh",
            },
          ]}
        />}
    </div>
  );
};

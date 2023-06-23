import { mergeStyles } from "@fluentui/react/lib/Styling";
import { BladeLink } from "@microsoft/azureportal-reactview/BladeLink";
import * as React from "react";

export const NavHeader: React.FC<{ currentViewName: string; currentSubscriptionId?: string }> = (props) => {
  console.log(`Render NavHeader`);

  const { currentViewName, currentSubscriptionId } = props;
  return (
    <div>
      <div
        className={mergeStyles({
          display: "flex",
          flexDirection: "row",
          columnGap: "20px",
        })}
      >
        <HeaderLink
          currentPageName={currentViewName}
          currentSubscriptionId={currentSubscriptionId}
          bladeName="DataTest1.ReactView"
          text={getViewName("DataTest1.ReactView")}
        />
        <HeaderLink
          currentPageName={currentViewName}
          currentSubscriptionId={currentSubscriptionId}
          bladeName="DataTest2.ReactView"
          text={getViewName("DataTest2.ReactView")}
        />
        <HeaderLink
          currentPageName={currentViewName}
          currentSubscriptionId={currentSubscriptionId}
          bladeName="DataTest3.ReactView"
          text={getViewName("DataTest3.ReactView")}
        />
        <HeaderLink
          currentPageName={currentViewName}
          currentSubscriptionId={currentSubscriptionId}
          bladeName="DataTest4.ReactView"
          text={getViewName("DataTest4.ReactView")}
        />
      </div>
      <h2 className={mergeStyles({ marginBottom: "40px" })}>{getViewName(currentViewName)}</h2>
    </div>
  );
};

function getViewName(view: string): string {
  switch (view) {
    case "DataTest1.ReactView":
      return "Simple list (no cache)";
    case "DataTest2.ReactView":
      return "Simple list";
    case "DataTest3.ReactView":
      return "List+Details (without context)";
    case "DataTest4.ReactView":
      return "List+Details (with context)";
  }
  return view;
}

const HeaderLink: React.FC<{
  bladeName: string;
  currentPageName: string;
  currentSubscriptionId?: string;
  text: string;
}> = (props) => {
  const { bladeName, currentPageName, currentSubscriptionId, text } = props;
  return (
    <BladeLink
      bladeReference={{ bladeName, extensionName: "DataManagementTest", parameters: { selectedSubscriptionId: currentSubscriptionId } }}
      disabled={currentPageName === bladeName}
    >
      {text}
    </BladeLink>
  );
};

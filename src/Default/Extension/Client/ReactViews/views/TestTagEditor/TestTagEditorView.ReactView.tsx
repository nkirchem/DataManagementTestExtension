import * as React from "react";
import { setTitle } from "@microsoft/azureportal-reactview/Az";
import { withContextPaneWidth, ContextPaneWidth } from "@microsoft/azureportal-reactview/ReactView";
import { DefaultButton, TextField, mergeStyles } from "@fluentui/react";
import { useUpdateResourceTagOperation } from "../../api/hooks/resourceHooks";

setTitle("Edit test tag");

const TestTagEditorView = ({ parameters }: { parameters: { resourceId: string; initialTestTagValue?: string } }) => {
  const { resourceId, initialTestTagValue } = parameters;
  const [tagValue, setTagValue] = React.useState(initialTestTagValue);
  const savedValue = React.useRef(initialTestTagValue);
  const tagUpdateOperation = useUpdateResourceTagOperation();

  return (
    <div>
      <h4>Test tag value:</h4>
      <TextField value={tagValue} onChange={(_ev, newValue) => setTagValue(newValue)} />
      <DefaultButton
        className={mergeStyles({ marginTop: 10 })}
        text={tagUpdateOperation.inProgress ? "Saving..." : "Save"}
        disabled={tagValue === savedValue.current}
        onClick={async () => {
          await tagUpdateOperation.execute(resourceId, tagValue);
          savedValue.current = tagValue;
        }}
      />
    </div>
  );
};

export default withContextPaneWidth(TestTagEditorView, ContextPaneWidth.Small);

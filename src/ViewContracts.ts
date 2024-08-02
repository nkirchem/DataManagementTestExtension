import type { ViewContract } from "@microsoft/azureportal-reactview/Navigation";

declare global {
    interface ViewContracts {
        "ResourceListView.ReactView": ViewContract<{
            component: typeof import("./views/ResourceList/ResourceListView.ReactView").default;
        }>;
        "SubscriptionListView.ReactView": ViewContract<{
            component: typeof import("./views/SubscriptionList/SubscriptionListView.ReactView").default;
        }>;
        "TestTagEditorView.ReactView": ViewContract<{
            component: typeof import("./views/TestTagEditor/TestTagEditorView.ReactView").default;
        }>;
    }
}

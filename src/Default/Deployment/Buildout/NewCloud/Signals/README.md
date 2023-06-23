# Azure Portal Extension New Cloud Buildout Signals

**NOTE**: These artifacts are intended to be used as a baseline for Azure Portal Extension teams to satisfy the New Cloud Service Buildout Signals requirement

## References

- <https://msazure.visualstudio.com/One/_wiki/wikis/One.wiki/391100/Ev2-Onboarding-Overview>
- <https://msazure.visualstudio.com/One/_wiki/wikis/One.wiki/391107/Detailed-Guidance-Templates>

## Instructions

1. Become familiar with the [Detailed Guidance & Templates](https://msazure.visualstudio.com/One/_wiki/wikis/One.wiki/391107/Detailed-Guidance-Templates)
1. Perform the token replacements listed in [Configuration](#configuration)
1. Perform any customizations that are required for the specific service(s)
1. Get the completed artifacts validated by the New Cloud Buildout PMs. See "Action on Service Teams" at <https://msazure.visualstudio.com/One/_wiki/wikis/One.wiki/391107/Detailed-Guidance-Templates>
1. Register the artifacts for PreBuildout, CoreBuildout and PostBuildout. See "Action on Service Teams" at <https://msazure.visualstudio.com/One/_wiki/wikis/One.wiki/391107/Detailed-Guidance-Templates>
1. You can test the registered artifacts using the provided scoped-files. See <https://ev2docs.azure.net/references/cmdlets/validate-buildout.html?q=Test-AzureServiceBuildout>

## Configuration

All values represented by braces {...} must be configured statically within the artifacts. This can be done either manually, or you can do it at build-time.

The following is a list of the tokens to be replaced...

| Token | Description |
| --- | --- |
| {ContactEmail} | The email address that will be used for Ev2 email notifications |
| {IcmConnectorId} | See <https://ev2docs.azure.net/features/buildout/rolloutSpec.html#incident> |
| {IcmRoutingId} | See <https://ev2docs.azure.net/features/buildout/rolloutSpec.html#incident> |
| {OwnerGroupEmail} | The administration group email address that will be used for the ServiceGroup. See <https://ev2docs.azure.net/references/api/new-service.html#servicespecification> |
| {OwnerGroupPrincipalId} | The administration group principal id that will be used for the ServiceGroup. See <https://ev2docs.azure.net/references/api/new-service.html#servicespecification> |
| {PortalExtensionName} | The extension name (same value as is used for extension deployments) |
| {ServiceDescription} | The service description or name that will be used for the ServiceGroup. See <https://ev2docs.azure.net/references/api/new-service.html#servicespecification> |
| {ServiceDisplayName} | The service display name (e.g. a verbose version of {PortalExtensionName}) |
| {ServiceGroup} | See <https://ev2docs.azure.net/features/buildout/genericServiceModel.html#servicegroup-naming-convention>. Be advised that these artifacts will append 2 segments to the ServiceGroup value that is used for the token replacement. These segments are, .NewCloud.PreBuildout, .NewCloud.CoreBuildout, and .NewCloud.PostBuildout |
| {ServiceTreeId} | Service tree id (guid) |
| {SubscriptionKey} | See "subscriptionKey" at <https://ev2docs.azure.net/features/buildout/genericServiceModel.html#serviceresourcegroupdefinition-properties> |
| {TenantId} | See "tenantId" at <https://ev2docs.azure.net/features/buildout/genericServiceModel.html#servicemetadata> |

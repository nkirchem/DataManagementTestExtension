{
  "extension": "HubsExtension",
  "version": "12.3.0.104111783.230602-2339",
  "sdkVersion": "12.3.0.1 (dev#e04111783f.230602-2339) Signed",
  "assetTypes": [
    {
      "name": "ArmExplorer",
      "permissions": [],
      "links": null
    },
    {
      "name": "ARGSharedQueries",
      "permissions": [],
      "links": null
    },
    {
      "name": "BrowseAll",
      "permissions": [],
      "links": null
    },
    {
      "name": "NonAssetResource",
      "permissions": [],
      "links": null
    },
    {
      "name": "BrowseAllResources",
      "permissions": [],
      "links": null
    },
    {
      "name": "BrowseInstanceLink",
      "permissions": [],
      "links": null
    },
    {
      "name": "BrowseRecentResources",
      "permissions": [],
      "links": null
    },
    {
      "name": "BrowseResource",
      "permissions": [],
      "links": null
    },
    {
      "name": "BrowseResourceGroup",
      "permissions": [],
      "links": null
    },
    {
      "name": "ResourceGraphExplorer",
      "permissions": [],
      "links": null
    },
    {
      "name": "Dashboards",
      "permissions": [],
      "links": null
    },
    {
      "name": "PrivateDashboards",
      "permissions": [],
      "links": null
    },
    {
      "name": "Deployments",
      "permissions": [],
      "links": null
    },
    {
      "name": "ResourceGroups",
      "permissions": [
        {
          "Name": "read",
          "Action": "Microsoft.Resources/subscriptions/resourceGroups/read"
        },
        {
          "Name": "deleteObject",
          "Action": "Microsoft.Resources/subscriptions/resourceGroups/delete"
        },
        {
          "Name": "write",
          "Action": "Microsoft.Resources/subscriptions/resourceGroups/write"
        },
        {
          "Name": "writeDeployments",
          "Action": "Microsoft.Resources/subscriptions/resourceGroups/deployments/write"
        },
        {
          "Name": "readDeployments",
          "Action": "Microsoft.Resources/subscriptions/resourceGroups/deployments/read"
        },
        {
          "Name": "readEvents",
          "Action": "Microsoft.Insights/events/read"
        }
      ],
      "links": null
    },
    {
      "name": "Tag",
      "permissions": [],
      "links": null
    }
  ],
  "parts": [
    {
      "name": "DeprecatedExtensionPart",
      "inputs": [],
      "commandBindings": [],
      "initialSize": null,
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "void"
        },
        "FilterModelsTypeExpression": {
          "TypeExpression": "{ [filterId: string]: FxFilters.AnyFilterModel; }"
        }
      },
      "supportedSizes": []
    },
    {
      "name": "MonitorChartPart",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 5,
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.MonitorChartPart.Parameters"
        },
        "FilterModelsTypeExpression": {
          "TypeExpression": "{ [filterId: string]: FxFilters.AnyFilterModel; }"
        }
      },
      "supportedSizes": [
        3,
        4,
        10,
        5,
        6
      ]
    },
    {
      "name": "ResourceTagsTile",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 10,
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.ResourceTagsBlade.Parameters"
        },
        "FilterModelsTypeExpression": {
          "TypeExpression": "{ [filterId: string]: FxFilters.AnyFilterModel; }"
        }
      },
      "supportedSizes": [
        1,
        2,
        3,
        10,
        5,
        6,
        11
      ]
    },
    {
      "name": "TagsTile",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 10,
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.TagsBlade.Parameters"
        },
        "FilterModelsTypeExpression": {
          "TypeExpression": "{ [filterId: string]: FxFilters.AnyFilterModel; }"
        }
      },
      "supportedSizes": [
        1,
        2,
        3,
        10,
        5,
        6,
        11
      ]
    },
    {
      "name": "BrowseServicePart",
      "inputs": [
        "assetTypeId"
      ],
      "commandBindings": [],
      "initialSize": 2
    },
    {
      "name": "ResourceGroupMapPart",
      "inputs": [
        "resourceGroup"
      ],
      "commandBindings": [],
      "initialSize": 5,
      "supportedSizes": [
        1,
        2,
        3,
        10,
        5,
        6,
        11
      ]
    },
    {
      "name": "ResourceMapPart",
      "inputs": [
        "assetOwner",
        "assetType",
        "assetId"
      ],
      "commandBindings": [],
      "initialSize": 5,
      "supportedSizes": [
        1,
        2,
        3,
        10,
        5,
        6,
        11
      ]
    },
    {
      "name": "Resources",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 8,
      "supportedSizes": []
    },
    {
      "name": "GettingStartedPart",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 99,
      "initialHeight": 5,
      "initialWidth": 4,
      "supportedSizes": []
    },
    {
      "name": "FeedbackTile",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 0
    },
    {
      "name": "ResourcePart",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 2,
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "{ id: string }"
        },
        "FilterModelsTypeExpression": null
      }
    },
    {
      "name": "PricingTierLauncher",
      "inputs": [
        "entityId"
      ],
      "commandBindings": [],
      "initialSize": 3,
      "supportedSizes": [
        0,
        1,
        2,
        3
      ]
    },
    {
      "name": "SpecComparisonPart",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 8,
      "supportedSizes": []
    },
    {
      "name": "SpecPickerListViewPartV3",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 9,
      "parameterProvider": true,
      "supportedSizes": []
    },
    {
      "name": "SpecPickerGridViewPartV3",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 9,
      "parameterProvider": true,
      "supportedSizes": []
    },
    {
      "name": "PricingTierLauncherV3",
      "inputs": [
        "entityId"
      ],
      "commandBindings": [],
      "initialSize": 3,
      "supportedSizes": [
        0,
        1,
        2,
        3
      ]
    },
    {
      "name": "ResourceFilterPart",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 8,
      "supportedSizes": []
    },
    {
      "name": "ResourceTagsPart",
      "inputs": [
        "resourceId"
      ],
      "commandBindings": [],
      "initialSize": null,
      "supportedSizes": []
    }
  ],
  "partTypeScriptDependencies": {
    "DefinitionFileNames": [
      {
        "FileName": "SharedTypes.d.ts"
      },
      {
        "FileName": "HubsExtension.d.ts"
      }
    ],
    "Modules": null
  },
  "blades": [
    {
      "name": "ARGBrowseAllInMenu",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "scope",
        "filter",
        "view"
      ],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.BrowseAll.InMenuParameters"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "ARGBrowseResourceGroupsInMenu",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "scope",
        "filter",
        "view"
      ],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.BrowseResourceGroups.InMenuParameters"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "ARGBrowseResourcesInMenu",
      "keyParameters": [],
      "inputs": [
        "resourceType"
      ],
      "optionalInputs": [
        "scope",
        "filter",
        "kind",
        "view"
      ],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.BrowseResource.InMenuParameters"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "ArgEditPinnedQueryBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "chartType",
        "name",
        "query",
        "queryId",
        "dashboardFilterQuery",
        "selectedSubs",
        "isShared",
        "formatResults",
        "queryScope"
      ],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.ArgEditPinnedQueryBlade.Parameters"
        },
        "ReturnedDataTypeExpression": {
          "TypeExpression": "HubsExtension.ArgEditPinnedQueryBlade.BladeResult"
        }
      },
      "isMenu": false
    },
    {
      "name": "ArgQueryBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "name",
        "query",
        "queryId",
        "description",
        "isShared",
        "formatResults",
        "queryScope"
      ],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.ArgQueryBlade.Parameters"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "BrowseAll",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "tagName",
        "tagValue",
        "filter",
        "view"
      ],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.BrowseAll.Parameters"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "BrowseAllLegacy",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "tagName",
        "tagValue",
        "filter",
        "view"
      ],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.BrowseAll.Parameters"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "BrowseQuery",
      "keyParameters": [],
      "inputs": [
        "query",
        "title",
        "supportsEdgeZone"
      ],
      "optionalInputs": [],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.BrowseQuery.Parameters"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "BrowseResource",
      "keyParameters": [],
      "inputs": [
        "resourceType"
      ],
      "optionalInputs": [
        "filter",
        "kind",
        "view"
      ],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.BrowseResource.Parameters"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "BrowseResourceGroups",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "filter",
        "view"
      ],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.BrowseResourceGroups.Parameters"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "BrowseResourcesWithTag",
      "keyParameters": [],
      "inputs": [
        "tagName",
        "tagValue"
      ],
      "optionalInputs": [
        "filter"
      ],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.BrowseResourcesWithTag.Parameters"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "ResourceGroupOverview",
      "keyParameters": [],
      "inputs": [
        "id"
      ],
      "optionalInputs": [],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "{ id: string; }"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "ResourcePicker",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "title",
        "submitButtonText",
        "infoBoxContent",
        "maxSelectedItems",
        "filters",
        "subscriptionIds",
        "customQuerySnippet",
        "preselectedResourceIds",
        "defaultGroupByValue"
      ],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.ResourcePicker.Parameters"
        },
        "ReturnedDataTypeExpression": {
          "TypeExpression": "HubsExtension.ResourcePicker.Results"
        }
      },
      "isMenu": false
    },
    {
      "name": "ResourceProperties",
      "keyParameters": [],
      "inputs": [
        "id"
      ],
      "optionalInputs": [
        "overrideIcon"
      ],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.ResourcePropertiesBlade.Parameters"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "TemplateEditorBladeV2",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "readOnlyTemplate",
        "template"
      ],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.TemplateEditorBladeV2.Parameters"
        },
        "ReturnedDataTypeExpression": {
          "TypeExpression": "HubsExtension.TemplateEditorBladeV2.Results"
        }
      },
      "isMenu": false
    },
    {
      "name": "GptGeneratorBlade",
      "keyParameters": [],
      "inputs": [
        "title",
        "subtitle",
        "infoBoxMessage",
        "placeholderText",
        "generateButtonText",
        "actionButtonText",
        "apiAction"
      ],
      "optionalInputs": [],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.GptGeneratorBlade.Parameters"
        },
        "ReturnedDataTypeExpression": {
          "TypeExpression": "HubsExtension.GptGeneratorBlade.Results"
        }
      },
      "isMenu": false
    },
    {
      "name": "InProductFeedbackBlade",
      "keyParameters": [],
      "inputs": [
        "bladeName",
        "cesQuestion",
        "cvaQuestion",
        "extensionName",
        "featureName",
        "surveyId"
      ],
      "optionalInputs": [
        "disableInfobox"
      ],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.InProductFeedbackBlade.Parameters"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "DeploymentDetailsBlade",
      "keyParameters": [],
      "inputs": [
        "id"
      ],
      "optionalInputs": [
        "packageId",
        "packageIconUri",
        "primaryResourceId",
        "assetTypeId",
        "provisioningHash",
        "createBlade"
      ],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.DeploymentDetailsMenuBlade.Parameters"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": true
    },
    {
      "name": "ResourceGroupMapBlade",
      "keyParameters": [
        "id"
      ],
      "inputs": [
        "id"
      ],
      "optionalInputs": [],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.ResourceGroupMapBlade.Parameters"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "ResourceTagsBlade",
      "keyParameters": [],
      "inputs": [
        "resourceId"
      ],
      "optionalInputs": [],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.ResourceTagsBlade.Parameters"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "TagsBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "subscriptionId"
      ],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.TagsBlade.Parameters"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "AssignTagsBlade",
      "keyParameters": [],
      "inputs": [
        "resources"
      ],
      "optionalInputs": [
        "tags"
      ],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.AssignTagsBlade.Parameters"
        },
        "ReturnedDataTypeExpression": {
          "TypeExpression": "HubsExtension.AssignTagsBlade.Results"
        }
      },
      "isMenu": false
    },
    {
      "name": "EditTagsBlade",
      "keyParameters": [],
      "inputs": [
        "resource"
      ],
      "optionalInputs": [
        "tagName"
      ],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "HubsExtension.EditTagsBlade.Parameters"
        },
        "ReturnedDataTypeExpression": {
          "TypeExpression": "HubsExtension.EditTagsBlade.Results"
        }
      },
      "isMenu": false
    },
    {
      "name": "BrowseFallback.ReactView",
      "keyParameters": [],
      "inputs": [
        "browsePrereqsRequest",
        "isAllResources",
        "isFallbackScenario",
        "isResourceGroups",
        "resourceTypes",
        "scope",
        "titlePrefix"
      ],
      "optionalInputs": [
        "errorCode",
        "browseType",
        "showRedirectMessage"
      ],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "{ browsePrereqsRequest: { resourceType: string; resourceTypeKey?: string; includeColumnsVersion?: number; includeFavoriteViewId?: boolean; }; isAllResources: boolean; isFallbackScenario: boolean; isResourceGroups: boolean; resourceTypes: string[]; scope: string; titlePrefix: string; errorCode?: number; browseType?: string; showRedirectMessage?: boolean; }"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "ColumnChooser.ReactView",
      "keyParameters": [],
      "inputs": [
        "subscriptions",
        "resourceType"
      ],
      "optionalInputs": [
        "view",
        "scopeResourceType",
        "version",
        "skipTags"
      ],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "{ subscriptions: readonly string[]; view?: (({ filter: string; filterFacets: { key: string; uniqueId?: string; display?: string; operator: any; value?: any; isAllValues?: boolean; facetKind: any; tagNames?: string[]; useExpansion?: true; }[]; groupByValue: string; sortedColumns: { sortBy: string; order: any; }[]; showAll: boolean; gridColumns: { id: string; visible: boolean; name?: string; }[]; gridColumnWidths: any; currentView: any; visualizationId: string; visualizationType: any; visualizationThreshold: any; visualizationBin: any; subscriptionIds?: string[]; selectedSubscriptionIds?: string[]; } & { id?: string; name?: string; }) | string); resourceType: string; scopeResourceType?: string; version?: number; skipTags?: boolean; }"
        },
        "ReturnedDataTypeExpression": {
          "TypeExpression": "{ update: boolean; columns: { id: string; name: string; lowerName: string; isTag: boolean; visible: boolean; }[]; }"
        }
      },
      "isMenu": false
    },
    {
      "name": "DeploymentsList.ReactView",
      "keyParameters": [],
      "inputs": [
        "resourceGroup"
      ],
      "optionalInputs": [
        "subscriptionId"
      ],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "{ resourceGroup: string; subscriptionId?: string; }"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "MoveResources.ReactView",
      "keyParameters": [],
      "inputs": [
        "resourceId",
        "moveType",
        "resourceIds"
      ],
      "optionalInputs": [],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "{ resourceId: string; moveType: number; resourceIds: string[]; }"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "MyAccess.ReactView",
      "keyParameters": [],
      "inputs": [
        "resourceId"
      ],
      "optionalInputs": [],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "{ resourceId: string; }"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "RecentResources.ReactView",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "void"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "ResourcesWithTag.ReactView",
      "keyParameters": [],
      "inputs": [
        "tagName",
        "tagValue"
      ],
      "optionalInputs": [],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "{ tagName: string; tagValue: string; }"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "Tags.ReactView",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [],
      "outputs": [],
      "typeScriptMetadata": {
        "ParametersTypeExpression": {
          "TypeExpression": "void"
        },
        "ReturnedDataTypeExpression": null
      },
      "isMenu": false
    },
    {
      "name": "UnauthorizedAssetBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "id"
      ],
      "outputs": [],
      "isMenu": false
    },
    {
      "name": "NotFoundAssetBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "id"
      ],
      "outputs": [],
      "isMenu": false
    },
    {
      "name": "UnavailableAssetBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "id"
      ],
      "outputs": [],
      "isMenu": false
    },
    {
      "name": "Resources",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "resourceType",
        "selectedSubscriptionId",
        "filter",
        "scope",
        "kind"
      ],
      "outputs": [],
      "isMenu": false
    },
    {
      "name": "BrowseAllResourcesBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "resourceType",
        "selectedSubscriptionId",
        "filter",
        "scope",
        "kind"
      ],
      "outputs": [],
      "isMenu": false
    },
    {
      "name": "BrowseAllInMenu",
      "keyParameters": [],
      "inputs": [
        "resourceType"
      ],
      "optionalInputs": [
        "scope"
      ],
      "outputs": [],
      "isMenu": false
    },
    {
      "name": "BrowseResourceBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "resourceType",
        "selectedSubscriptionId",
        "filter",
        "scope",
        "kind"
      ],
      "outputs": [],
      "isMenu": false
    },
    {
      "name": "BrowseInMenu",
      "keyParameters": [],
      "inputs": [
        "resourceType"
      ],
      "optionalInputs": [
        "scope",
        "kind"
      ],
      "outputs": [],
      "isMenu": false
    },
    {
      "name": "BrowseInstanceLinkBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "resourceType",
        "selectedSubscriptionId",
        "filter",
        "scope",
        "kind"
      ],
      "outputs": [],
      "isMenu": false
    },
    {
      "name": "BrowseResourceGroupBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "resourceType",
        "selectedSubscriptionId",
        "filter",
        "scope",
        "kind"
      ],
      "outputs": [],
      "isMenu": false
    },
    {
      "name": "BrowseGroupsInMenu",
      "keyParameters": [],
      "inputs": [
        "resourceType"
      ],
      "optionalInputs": [
        "scope"
      ],
      "outputs": [],
      "isMenu": false
    },
    {
      "name": "MapResourceGroupBlade",
      "keyParameters": [],
      "inputs": [
        "id"
      ],
      "optionalInputs": [],
      "outputs": [],
      "isMenu": false
    },
    {
      "name": "DeployToAzure",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [],
      "outputs": [],
      "parameterProvider": true,
      "isMenu": false
    },
    {
      "name": "DeployFromTemplateBlade",
      "keyParameters": [],
      "inputs": [
        "internal_bladeCallerParams"
      ],
      "optionalInputs": [],
      "outputs": [],
      "parameterProvider": true,
      "isMenu": false
    },
    {
      "name": "ParametersEditorBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [],
      "outputs": [],
      "parameterProvider": true,
      "isMenu": false
    },
    {
      "name": "ParametersFileEditorBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [],
      "outputs": [],
      "parameterProvider": true,
      "isMenu": false
    },
    {
      "name": "TemplateEditorBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [],
      "outputs": [],
      "parameterProvider": true,
      "isMenu": false
    },
    {
      "name": "DeploymentInputsBlade",
      "keyParameters": [
        "id"
      ],
      "inputs": [
        "id"
      ],
      "optionalInputs": [
        "referrerInfo"
      ],
      "outputs": [],
      "isMenu": false
    },
    {
      "name": "DeploymentOutputsBlade",
      "keyParameters": [
        "id"
      ],
      "inputs": [
        "id"
      ],
      "optionalInputs": [
        "referrerInfo"
      ],
      "outputs": [],
      "isMenu": false
    },
    {
      "name": "ResourceMenuBlade",
      "keyParameters": [],
      "inputs": [
        "id"
      ],
      "optionalInputs": [
        "menuid",
        "menucontext",
        "referrerInfo"
      ],
      "outputs": [],
      "isMenu": true
    }
  ],
  "bladeTypeScriptDependencies": {
    "DefinitionFileNames": [
      {
        "FileName": "SharedTypes.d.ts"
      },
      {
        "FileName": "HubsExtension.d.ts"
      }
    ],
    "Modules": null
  },
  "commands": [
    {
      "name": "MoveResourceCommand",
      "inputs": [
        "resourceId"
      ]
    }
  ],
  "controls": []
}
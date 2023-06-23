/**
 * Shared type declarations for types shared between FX and React in HubsExtension.
 *
 * IMPORTANT NOTE : This file must compile cleanly in React and must not contain any msportalfx or ko constructs nor
 *                  anything in FX.
 */
declare namespace HubsExtension {
    namespace ArgQueryBlade {
        /**
         * The supported chart types.
         */
        const enum ChartType {
            /**
             * Do not use.
             */
            None = 0,

            /**
             * Bar chart.
             */
            BarChart = 1,

            /**
             * Donut chart.
             */
            DonutChart = BarChart << 1,

            /**
             * Map.
             */
            Map = DonutChart << 1,

            /**
             * Grid.
             */
            Grid = Map << 1,
        }

        /**
         * The supported query scopes.
         */
        const enum QueryScope {
            /**
             * Query is scoped to a tenant.
             */
            Tenant = 0,

            /**
             * Query is scoped to specific management groups.
             */
            ManagementGroup = 1,

            /**
             * Query is scoped to specific subscriptions.
             */
            Subscription = 2,
        }
    }

    namespace Browse {
        /**
         * Base type of the item displayed in React Browse Grid.
         */
        type BrowseItemBase = {
            /**
             * The resource ID for the recent resource.
             */
            resourceId: string;

            /**
             * The display name of the resource if it's not directly extractable from the resource ID.
             */
            name?: string;

            /**
             * The location as is returned by ARM.
             */
            location?: string;

            /**
             * The resource kind returned by ARM.
             */
            resourceKind?: string;
        };

        /**
         * The base recent entry. This is the data that is serialized to user settings.
         */
        type RecentEntryBase = BrowseItemBase & {
            /**
             * Time the asset was accessed.
             */
            readonly timeStamp: number;
        };

        /**
         * Constants for facet operators.
         */
        const enum FacetOperator {
            /**
             * Do not use.
             */
            DoNotUse = 0,

            /**
             * Equals operator.
             */
            Equals,

            /**
             * Not equals operator.
             */
            NotEquals,

            /**
             * Contains operator.
             */
            Contains,

            /**
             * Not contains operator.
             */
            NotContains,

            /**
             * Starts with operator.
             */
            StartsWith,

            /**
             * Not starts with operator.
             */
            NotStartsWith,

            /**
             * Ends with operator.
             */
            EndsWith,

            /**
             * Not ends with operator.
             */
            NotEndsWith,
        }

        /**
         * Constants for facet kinds.
         */
        const enum FacetKind {
            /**
             * Do not use.
             */
            DoNotUse = 0,

            /**
             * Column kind.
             */
            Column,

            /**
             * Tag kind.
             */
            Tag,
        }

        /**
         * The browse view type for the saved views.
         */
        const enum BrowseViewType {
            /**
             * Do not use.
             */
            DoNotUse = 0,

            /**
             * The list (grid) view.
             */
            List,

            /**
             * The visualization view.
             */
            Visualization,
        }

        /**
         * Interface for facet value.
         */
        type FacetValue = {
            /**
             * The name of the facet.
             */
            readonly name: string;

            /**
             * The display name.
             */
            readonly displayName?: string;

            /**
             * The count.
             */
            readonly count?: string;
        };

        /**
         * Interface for facet filter.
         */
        type FacetFilter<T> = {
            /**
             * The key (column) for the facet filter.
             */
            readonly key: string;

            /**
             * The unique Id.
             */
            readonly uniqueId?: string;

            /**
             * The display string.
             */
            readonly display?: string;

            /**
             * The facet operator.
             */
            readonly operator: FacetOperator;

            /**
             * The value.
             */
            readonly value?: T;

            /**
             * The flag indicating if all values are selected or not.
             */
            readonly isAllValues?: boolean;

            /**
             * The facet kind.
             */
            readonly facetKind: FacetKind;

            /**
             * The list of tag names.
             */
            readonly tagNames?: string[];

            /**
             * The flag indicating if expansion is used or not.
             */
            readonly useExpansion?: true;
        };

        type GridColumn = {
            /**
             * The column ID.
             */
            readonly id: string;

            /**
             * The column visibility.
             */
            readonly visible: boolean;

            /**
             * The column name.
             */
            readonly name?: string;
        };

        /**
         * The sort order.
         */
        const enum SortOrder {
            /**
             * Do not use.
             */
            Unused = 0,

            /**
             * Sort in ascending order.
             */
            Ascending,

            /**
             * Sort in descending order.
             */
            Descending,
        }

        /**
         * The sort column for the view.
         */
        type SortColumn = {
            /**
             * The column ID to sort by.
             */
            readonly sortBy: string;

            /**
             * The sort order.
             */
            readonly order: SortOrder;
        };

        /**
         * The visualization threshold value IDs.
         * NOTE: given that the values are stored in the views, the existing values must not changed.
         */
        const enum VisualizationThresholdId {
            /**
             * Cap to the threshold for the top 'n' items but include an "other" item for the remaining items.
             */
            TopWithOther = 1,

            /**
             * Cap to the threshold for the top 'n' items.
             */
            Top,

            /**
             * Cap to the threshold for the bottom 'n' items.
             */
            Bottom,

            /**
             * Cap to the threshold for the bottom 'n' items but include an "other" item for the remaining items.
             */
            BottomWithOther,
        }

        /**
         * The visualization bin value IDs.
         * NOTE: given that the values are stored in the views, the existing values must not changed.
         */
        const enum VisualizationBinId {
            /**
             * No date/time binning.
             */
            DateTimeBinNone = 1000,

            /**
             * Bin the date/time to the month.
             */
            ToMonth,

            /**
             * Bin the date/time to the year.
             */
            ToYear,

            /**
             * Bin the date/time to hour of the day.
             */
            ByHourOfDay,

            /**
             * Bin the date/time to day of week.
             */
            ByDayOfWeek,

            /**
             * Bin the date/time to day of month.
             */
            ByDayOfMonth,

            /**
             * Bin the date/time to month of year.
             */
            ByMonthOfYear,
        }

        /**
         * Saved browse view description.
         * This is the smallest amount of data required for the menu and blade.
         */
        type BrowseViewDescription = {
            /**
             * The ID of the view.
             */
            readonly id?: string;

            /**
             * The name of the view (display string).
             */
            readonly name?: string;
        };

        /**
         * Interface for Saved browse view.
         */
        type BrowseView = BrowseViewDescription & {
            /**
             * The filter string.
             */
            readonly filter: string;

            /**
             * The list of filter facets.
             */
            readonly filterFacets: FacetFilter<Browse.FacetValue[] | string>[];

            /**
             * The group by value.
             */
            readonly groupByValue: string;

            /**
             * The list of sorted columns.
             */
            readonly sortedColumns: SortColumn[];

            /**
             * The flag indicating if all values are selected.
             */
            readonly showAll: boolean;

            /**
             * The list of grid columns.
             */
            readonly gridColumns: GridColumn[];

            /**
             * The grid column widths.
             */
            readonly gridColumnWidths: Record<string, string>;

            /**
             * The current view type for the saved view.
             */
            readonly currentView: BrowseViewType;

            /**
             * The current visualization ID for the saved view.
             */
            readonly visualizationId: string;

            /**
             * The current visualization type for the saved view.
             */
            readonly visualizationType: HubsExtension.ArgQueryBlade.ChartType;

            /**
             * The optional visualization threshold ID for the saved view.
             */
            readonly visualizationThreshold: VisualizationThresholdId;

            /**
             * The optional visualization bin ID for the saved view.
             */
            readonly visualizationBin: VisualizationBinId;

            /**
             * The optional subscription IDs for the saved view.
             */
            readonly subscriptionIds?: string[];

            /**
             * The optional selected subscription IDs for the saved view.
             * This is only valid when subscriptionIds is valid.
             */
            readonly selectedSubscriptionIds?: string[];
        };
    }

    /**
     * Declarations for the BrowseAll blade.
     *
     * IMPORTANT NOTE : This must remain in this file instead of HubsExtension due to limitation of the precompiler
     *                  where this file will be missing from the Hubs PDE file.
     */
    namespace BrowseAll {
        /**
         * The base blade parameters.
         */
        interface BaseParameters {
            /**
             * Optional filter (search) input that is applied on blade load.
             */
            readonly filter?: string;

            /**
             * Optional browse view
             */
            readonly view?: HubsExtension.Browse.BrowseView;
        }

        /**
         * The blade parameters.
         */
        interface Parameters extends BaseParameters {
            /**
             * Optional tag name input to pre-populate the tag filter.
             */
            readonly tagName?: string;

            /**
             * Optional tag value input to pre-populate the tag filter.
             */
            readonly tagValue?: string;
        }

        /**
         * The in-menu blade parameters.
         */
        interface InMenuParameters extends BaseParameters {
            /**
             * Optional scope parameter for the scope of the resources.
             */
            readonly scope?: string;
        }
    }

    /**
     * Declarations for the BrowseResourceGroups blade.
     *
     * IMPORTANT NOTE : This must remain in this file instead of HubsExtension due to limitation of the precompiler
     *                  where this file will be missing from the Hubs PDE file.
     */
    namespace BrowseResourceGroups {
        /**
         * The base blade parameters.
         */
        interface BaseParameters {
            /**
             * Optional filter (search) input that is applied on blade load.
             */
            readonly filter?: string;

            /**
             * Optional browse view
             */
            readonly view?: HubsExtension.Browse.BrowseView;
        }

        /**
         * The blade parameters.
         */
        interface Parameters extends BaseParameters {}

        /**
         * The in-menu blade parameters.
         */
        interface InMenuParameters extends BaseParameters {
            /**
             * Optional scope parameter for the scope of the resources.
             */
            readonly scope?: string;
        }
    }

    /**
     * Declarations for the BrowseResource blade.
     *
     * IMPORTANT NOTE : This must remain in this file instead of HubsExtension due to limitation of the precompiler
     *                  where this file will be missing from the Hubs PDE file.
     */
    namespace BrowseResource {
        /**
         * The base blade parameters.
         */
        interface BaseParameters {
            /**
             * Optional filter (search) input that is applied on blade load.
             */
            readonly filter?: string;

            /**
             * The ARM resource type, for example Microsoft.Compute/virtualMachines.
             */
            readonly resourceType: string;

            /**
             * Optional kind (filter-to-kind) input that is applied on blade load.
             */
            readonly kind?: string;

            /**
             * Optional browse view
             */
            readonly view?: HubsExtension.Browse.BrowseView;
        }

        /**
         * The blade parameters.
         */
        interface Parameters extends BaseParameters {}

        /**
         * The in-menu blade parameters.
         */
        interface InMenuParameters extends BaseParameters {
            /**
             * Optional scope parameter for the scope of the resources.
             */
            readonly scope?: string;
        }
    }

    /**
     * Declarations for the BrowseConfiguration blade.
     *
     * IMPORTANT NOTE : This must remain in this file instead of HubsExtension due to limitation of the precompiler
     *                  where this file will be missing from the Hubs PDE file.
     */
    namespace BrowseConfiguration {
        /**
         * The blade parameters.
         */
        interface Parameters {
            readonly resourceType: string;
            readonly scope?: string;
            readonly version: 1 | 2;
            readonly subscriptions: string[];
            readonly view: HubsExtension.Browse.BrowseView;
        }

        /**
         * The blade results.
         */
        interface Results {
            readonly update: boolean;
            readonly view: HubsExtension.Browse.BrowseView;
        }
    }

    /**
     * Declarations for the Column Chooser Blade
     */
    namespace ColumnChooserBlade {
        /**
         * Column in the chooser data.
         */
        export type ChooserColumn = {
            /**
             * The ID for the column.
             */
            readonly id: string;

            /**
             * The name (display) for the column.
             */
            readonly name: string;

            /**
             * Lowercase version of the name for quick lookup.
             */
            readonly lowerName: string;

            /**
             * The flag which indicates this column represents a tag.
             */
            readonly isTag: boolean;

            /**
             * The flag which indicates the column is selected or available.
             */
            visible: boolean;
        };
    }

    /**
     * Declarations for ARG interfaces (cloned from FxHubs/ArtInterfacesCore.ts)
     */
    namespace ArgInterfaces {
        /**
         * The blade details for the resource type or its kind.
         */
        type ResourceTypeOrKindBladeDetails = {
            /**
             * The name of the blade.
             */
            readonly bladeName: string;

            /**
             * The extension to load the blade from.
             */
            readonly extensionName: string;
        };

        /**
         * The part details for the resource type or its kind.
         */
        type ResourceTypeOrKindPartDetails = {
            /**
             * The name of the part.
             */
            readonly partName: string;

            /**
             * The extension for the part.
             */
            readonly extensionName: string;
        };

        /**
         * Details about the resource type or its kind.
         */
        type ResourceTypeOrKindDetails = {
            /**
             * The description for the asset type/kind.
             */
            readonly description: string;

            /**
             * The display name.
             */
            readonly displayName: Readonly<CompositeDisplayName>;

            /**
             * The icon.
             */
            readonly icon: Image;

            /**
             * The options for the asset type or the kind.
             */
            readonly options: any; // cons enums don't work

            /**
             * The blade details for each item. This is not set if the resource type
             * is set to use the Hubs resource menu blade.
             */
            readonly bladeDetails?: Readonly<ResourceTypeOrKindBladeDetails>;

            /**
             * The part details for each item. If this is not set
             * the default properties part from HubsExtension is used.
             */
            readonly partDetails?: Readonly<ResourceTypeOrKindPartDetails>;

            /**
             * The flag to hide (or show) the browse info box (overrides PDL BrowseInfoBox).
             */
            readonly hideBrowseInfoBox?: boolean;

            /**
             * Flag to indicate if the type or kind is marked as preview.
             */
            readonly isPreview?: boolean;

            /**
             * Flag to indicate if the type or kind is marked as disabled by policy.
             */
            readonly isDisabled?: boolean;
        };

        /**
         * Details about the resource type kind.
         */
        type ResourceKindDetails = ResourceTypeOrKindDetails & {
            /**
             * The array of kinds which is represented by this kind.
             */
            readonly kinds?: ReadonlyArray<string>;
        };

        /**
         * The details of a resource type which includes its kinds.
         */
        export type ResourceTypeDetails = ResourceTypeOrKindDetails & {
            /**
             * The asset id in the form extension_assettype.
             */
            readonly assetId: string;

            /**
             * The ARG browse option that the extension has chosen for this resource/asset type.
             */
            readonly browseOption?: any;

            /**
             * A map representing the various kinds supported by this resource type.
             */
            readonly kindMap?: Record<string, ResourceKindDetails>;

            /**
             * The default kind, if there is one.
             */
            readonly defaultKind?: Readonly<ResourceKindDetails>;

            /**
             * The contracts for the asset type.
             */
            readonly contracts: any;

            /**
             * The browse type for the asset type.
             */
            readonly browseType: any;

            /**
             * The create blade associated with the asset
             */
            readonly noPdlCreateBlade?: string;

            /**
             * The extension with the create blade associated with the asset
             */
            readonly noPdlCreateExtension?: string;

            /**
             * The create blade parameters associated with the asset
             */
            readonly noPdlCreateParameters?: any;

            /**
             * The marketplace item id associated with the asset.
             */
            readonly marketplaceItemId?: string;

            /**
             * The marketplace menu item id associated with the asset.
             */
            readonly marketplaceMenuItemId?: string;

            /**
             * The documentation links for asset type.
             */
            readonly links?: ReadonlyArray<Link>;

            /**
             * The hidden commands list for asset type.
             */
            readonly hiddenCommands?: ReadonlyArray<string>;

            /**
             * The browse command layout experiments.
             */
            readonly browseCommandExperiments?: Record<string, AssetTypeBrowseCommandLayout>;

            /**
             * The routing type for the resource type.
             */
            readonly routingType?: ResourceRoutingType;

            /**
             * The API resource type for ARM.
             * This is only valid for end-point-routing resources.
             */
            readonly topLevelResourceTypeAlias?: string;

            /**
             * The ARM API version to use for this resource type.
             */
            readonly apiVersion?: string;

            /**
             * The optional array of proxy routing filters for this resource type.
             */
            readonly proxyRoutingFilters?: any[];

            /**
             * The API resource type for ARM.
             * This is only valid for tenant-routing resources.
             */
            readonly topLevelTenantAlias?: string;
        };

        /**
         * This represents an asset type display name in it's four forms.
         */
        type CompositeDisplayName = {
            /**
             * The singular, formal-cased display name.
             */
            singular: string;

            /**
             * The plural, formal-cased display name.
             */
            plural: string;

            /**
             * The singular, lower-cased display name.
             */
            lowerSingular: string;

            /**
             * The plural, lower-cased display name.
             */
            lowerPlural: string;

            /**
             * The service display name.
             */
            service?: string;
        };

        /**
         * Data type used for rendering images's.
         */
        type Image = {
            /**
             * Stores the type of image (custom SVG/image or a built in SVG).
             */
            readonly type: number;

            /**
             * Stores the SVG element, or URI to image file.
             */
            readonly data?: string;

            /**
             * Stores the palette of the element.
             */
            readonly palette?: number;

            /**
             * Stores the options of the element.
             */
            readonly options?: ImageOptions;
        };

        type ImageOptions = {
            /**
             * Stores the palette of the element.
             */
            palette?: number;

            /**
             * Title attribute of the svg.
             */
            title?: string;

            /**
             * Description of the svg.
             */
            description?: string;

            /**
             * Badge
             */
            badge?: ImageBadge;

            /**
             * Adds a single custom class, must start with msportalfx or the extension prefix for CSS: "ext-".
             */
            customClass?: string;
        };

        /**
         * Data type used for rendering a images's badge.
         */
        type ImageBadge = {
            /**
             * Badge icon.
             */
            image: Image;

            /**
             * Override the default width, must be in a percentage ie (width: 10).
             */
            width?: number;
        };

        /**
         * The documentation link for the asset type.
         */
        type Link = {
            /**
             * The link title for the asset type.
             */
            title: string;

            /**
             * The link uri for the asset type.
             */
            uri: string;
        };

        /**
         * The browse command experiments for the asset type.
         */
        type AssetTypeBrowseCommandLayout = {
            /**
             * The array of non selection commands.
             */
            readonly commands?: ReadonlyArray<string>;

            /**
             * The array of selection commands.
             */
            readonly selectionCommands?: ReadonlyArray<string>;
        };

        export enum ResourceRoutingType {
            /**
             * Default routing type, resource-group level resources.
             */
            Default = 0,

            /**
             * Tenant (provider) based resources.
             */
            Tenant = 1,

            /**
             * Extension based resources.
             */
            Extension = 2,

            /**
             * Provider proxy based resources.
             */
            ProviderProxy = 3,
        }
    }
}

declare module "ClientResources" {
    export = ClientResources;
    const ClientResources: {
        readonly AssetPropertyNames: {
            readonly CloudService: {
                /**
                 * The text "Location"
                 */
                readonly location: string;
            };
            readonly Resource: {
                /**
                 * The text "Resource group"
                 */
                readonly resourceGroup: string;
            };
        };
        readonly AssetType: {
            /**
             * The text "Consistent experiences across Azure enable users to leverage a few well-known and researched design patterns throughout Azure."
             */
            readonly description: string;
            /**
             * The text "UX UI design patterns sample extension ibiza consistency"
             */
            readonly keywords: string;
            /**
             * The text "Get consistent"
             */
            readonly link1Title: string;
            /**
             * The text "http://www.bing.com"
             */
            readonly link1Uri: string;
            /**
             * The text "Learn more"
             */
            readonly link2Title: string;
            /**
             * The text "http://www.bing.com"
             */
            readonly link2Uri: string;
        };
        readonly AssetTypeNames: {
            readonly Resource: {
                /**
                 * The text "my resources"
                 */
                readonly lowerPlural: string;
                /**
                 * The text "my resource"
                 */
                readonly lowerSingular: string;
                /**
                 * The text "My Resources"
                 */
                readonly plural: string;
                /**
                 * The text "My Resource"
                 */
                readonly singular: string;
            };
        };
        readonly GetStarted: {
            readonly Tab1: {
                /**
                 * The text "Build, manage, and monitor your resources using your Portal extension."
                 */
                readonly description: string;
                /**
                 * The text "Get started with My resource."
                 */
                readonly title: string;
            };
            readonly Tab2: {
                readonly Feature1: {
                    /**
                     * The text ""Explore the world of cloud computing and learn what sets Azure apart""
                     */
                    readonly description: string;
                    /**
                     * The text ""Get to know Azure""
                     */
                    readonly title: string;
                };
                readonly Feature2: {
                    /**
                     * The text ""Our mission is to empower every person and organization on the planet to achieve more.""
                     */
                    readonly description: string;
                    /**
                     * The text ""Empowering others""
                     */
                    readonly title: string;
                };
                readonly Feature3: {
                    /**
                     * The text ""GitHub is a development platform inspired by the way you work. From open source to business, you can host and review code, manage projects, and build software alongside 40 million developers.""
                     */
                    readonly description: string;
                    /**
                     * The text ""Built for developers""
                     */
                    readonly title: string;
                };
                /**
                 * The text "Tutorials"
                 */
                readonly tutotials: string;
            };
        };
        readonly Tile: {
            /**
             * The text "Following patterns across Azure enable users to leverage a few well-known and researched design patterns throughout Azure."
             */
            readonly consistencyDescription: string;
            /**
             * The text "Azure portal design patterns"
             */
            readonly consistencyTitle: string;
            /**
             * The text "To avoid jarring context switches, toolbar buttons and links within pages should open blades using the openContextPane method."
             */
            readonly contextPaneDescription: string;
            /**
             * The text "Open blade in context pane - Keys"
             */
            readonly contextPaneLinkTitle: string;
            /**
             * The text "Open blade in context pane"
             */
            readonly contextPaneTitle: string;
            /**
             * The text "Links within pages and toolbar buttons should re-use existing menu items by using the switchItem method"
             */
            readonly menuDescription: string;
            /**
             * The text "Open Item1"
             */
            readonly menuLinkTitle: string;
            /**
             * The text "Select menu item"
             */
            readonly menuTitle: string;
            /**
             * The text "You can open extension blade and pass needed parameters to navigate no the next experience."
             */
            readonly openBladeDescription: string;
            /**
             * The text "Open blade - Keys"
             */
            readonly openBladeLinkTitle: string;
            /**
             * The text "Open blade"
             */
            readonly openBladeTitle: string;
        };
        /**
         * The text "Delete"
         */
        readonly delete: string;
        /**
         * The text "Are you sure you want to delete this resource?"
         */
        readonly deleteConfirmation: string;
        /**
         * The text "Are you sure you want to delete this resource?"
         */
        readonly deleteResourceMessage: string;
        /**
         * The text "Delete resource"
         */
        readonly deleteResourceTitle: string;
        /**
         * The text "Delete resource(s)"
         */
        readonly deleteResourcesTitle: string;
        /**
         * The text "Hyperlink title"
         */
        readonly esentialsAdditionalRightLink1Title: string;
        /**
         * The text "AzurePortalExtension2"
         */
        readonly extensionName: string;
        /**
         * The text "http://msdn.microsoft.com"
         */
        readonly htmlSiteMSDNAddress: string;
        /**
         * The text "Click here"
         */
        readonly hyperlinkLabel: string;
        /**
         * The text "Item1"
         */
        readonly item1: string;
        /**
         * The text "one keyword1"
         */
        readonly item1Keywords: string;
        /**
         * The text "Item2"
         */
        readonly item2: string;
        /**
         * The text "two keyword2"
         */
        readonly item2Keywords: string;
        /**
         * The text "Primary key"
         */
        readonly keyPrimaryKeyLabel: string;
        /**
         * The text "Secondary key"
         */
        readonly keySecondaryKeyLabel: string;
        /**
         * The text "Keys"
         */
        readonly keys: string;
        /**
         * The text "connection string"
         */
        readonly keysKeywords: string;
        /**
         * The text "Learn more"
         */
        readonly learnMore: string;
        /**
         * The text "Link Property Label"
         */
        readonly linkPropertyLabel: string;
        /**
         * The text "Loading..."
         */
        readonly loadingText: string;
        /**
         * The text "Resource-specific group"
         */
        readonly menuGroup1: string;
        /**
         * The text "www.microsoft.com"
         */
        readonly microsoftUri: string;
        /**
         * The text "Move"
         */
        readonly move: string;
        /**
         * The text "Overview"
         */
        readonly overview: string;
        /**
         * The text "Summary Home"
         */
        readonly overviewKeywords: string;
        /**
         * The text "Properties"
         */
        readonly propertiesBladeTitle: string;
        /**
         * The text "Property from resource"
         */
        readonly propertyFromResourceLabel: string;
        /**
         * The text "Property label"
         */
        readonly propertyLabel: string;
        /**
         * The text "Quick Start Blade Subtitle"
         */
        readonly quickStartBladeSubtitle: string;
        /**
         * The text "Quick Start Blade Title"
         */
        readonly quickStartBladeTitle: string;
        /**
         * The text "Quick Start Description"
         */
        readonly quickStartDescription: string;
        /**
         * The text "This section has an Icon and will open a new browser tab on click. These two factors are mutually exclusive as the first depends on if an iconUri is set and the second because section.selectable was populated. This description text is multiline."
         */
        readonly quickStartInfoListDesc1: string;
        /**
         * The text "PDL provides openBlades and links[] of the InfoListBladeLinkContract type will be opened in blades. The tile supports both blade links and hyperlinks in the same section. Numbers are used when iconUri is not set."
         */
        readonly quickStartInfoListDesc2: string;
        /**
         * The text "Icon & Selectable"
         */
        readonly quickStartInfoListTitle1: string;
        /**
         * The text "Section that opens blade"
         */
        readonly quickStartInfoListTitle2: string;
        /**
         * The text "Quick Start"
         */
        readonly quickStartShortTitle: string;
        /**
         * The text "Quick Start"
         */
        readonly quickStartTitle: string;
        /**
         * The text "Refresh"
         */
        readonly refresh: string;
        /**
         * The text "Command1"
         */
        readonly resourceCommand: string;
        /**
         * The text "Resource Name"
         */
        readonly resourceKeyBladeSubtitle: string;
        /**
         * The text "Keys"
         */
        readonly resourceKeyBladeTitle: string;
        /**
         * The text "Location"
         */
        readonly resourceLocationColumn: string;
        /**
         * The text "Name"
         */
        readonly resourceNameColumn: string;
        /**
         * The text "Resource Subtitle"
         */
        readonly resourceOverviewBladeSubtitle: string;
        /**
         * The text "Resource Title"
         */
        readonly resourceOverviewBladeTitle: string;
        /**
         * The text "Resource part subtitle"
         */
        readonly resourcePartSubtitle: string;
        /**
         * The text "Resource part title"
         */
        readonly resourcePartTitle: string;
        /**
         * The text "Important setting"
         */
        readonly resourceSettingMenuItem1: string;
        /**
         * The text "resource specific"
         */
        readonly resourceSettingMenuItem1Keywords: string;
        /**
         * The text "Settings"
         */
        readonly settings: string;
        /**
         * The text "Status"
         */
        readonly status: string;
        /**
         * The text "Subscription Id"
         */
        readonly subscriptionId: string;
        /**
         * The text "Text Property Label"
         */
        readonly textPropertyLabel: string;
        /**
         * The text "yes"
         */
        readonly yes: string;
    };
}
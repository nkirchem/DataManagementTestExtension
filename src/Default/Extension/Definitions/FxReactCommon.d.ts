declare namespace Common {

    /**
     * Helper type for determining if a return / parameter type is "Proxyable" across the postMessage boundary.
     */
    export type Proxyable = PrimitiveObject | ProxyablePrimitive | Array<PrimitiveObject | ProxyablePrimitive>;

    /**
     * Helper type for determining if the supplied function map correctly declares Return and Parameter types for each function
     */
    export type ValidatedFunctionMap<T> = {
        [Key in keyof T]: ValidatedEntry<T[Key]>;
    };

    /**
     * This interface provides typings for the FunctionProxy, which allows communication between your ReactModel and corresponding ReactView.
     * This can be useful for migration based scenarios, and support bi-directional function calling (you can invoke a function from the model or the view).
     * It provides strong type safety via the FunctionMap generic, which expects the shape of the function map to be:
     * ```typescript
     *     interface MyFunctionMap {
     *         functionName: {
     *             parameters: number;
     *             returns: string;
     *         };
     *         functionName2: {
     *             returns: Promise<{someReturnType: boolearn}>;
     *         };
     *     }
     *     // This can be invoked/registered with the name "functionName":
     *     invoke("functionName", 7).then(i => console.log(i))
     *     register("functionName", (num) => "test")
     * ```
     * Note: This crosses the post message boundary, and will not work if non-serializable data is passed for either return or parameter types,
     * correctly utilizing the function map, though slightly involved will catch these errors at build time (and will aid in future refactors).
     */
    export interface FunctionProxy<FunctionMap extends ValidatedFunctionMap<FunctionMap>> {
        /**
         * Invoke a function that has been registered.
         * @param name The name of the function that has been registered
         * @param parameters The parameters to pass to the function, null if you need to skip it
         * @param ignoreResponse Skip receiving a response, and ignore any errors thrown
         * @returns A promise that resolves to the response of the registered function, Promises are unwrapped by one level
         */
        invoke<T extends keyof JustParameterless<FunctionMap>>(name: T): DetermineReturnType<JustParameterless<FunctionMap>, T>;
        invoke<T extends keyof JustParameters<FunctionMap>>(name: T, parameters: FunctionMap[T] extends HasParameters ? FunctionMap[T]["parameters"] : never): DetermineReturnType<JustParameters<FunctionMap>, T>;
        invoke<T extends keyof JustParameterless<FunctionMap>>(name: T, parameters: null, ignoreResponse: true): DetermineReturnType<JustParameterless<FunctionMap>, T>;
        invoke<T extends keyof JustParameters<FunctionMap>>(name: T, parameters: FunctionMap[T] extends HasParameters ? FunctionMap[T]["parameters"] : never, ignoreResponse: true): DetermineReturnType<JustParameters<FunctionMap>, T>;
        /**
         * Register so it can be called from the other side. Promises returned will be unwrapped by a single layer. e.g returning "Promise<void>"" will still be Promise<void> on the caller side. Returning "void" will return "Promise<void>" on the caller side.
         * @param name The name of the function to register as (must be a key of the FunctionMap)
         * @param handler The handler to call when the function is "invoked"
         */
        register<T extends keyof JustParameters<FunctionMap>, FuncInfo extends JustParameters<FunctionMap>[T] = JustParameters<FunctionMap>[T], HandlerReturnType extends FuncInfo extends ReturnsSomething ? FuncInfo["returns"] : void = FuncInfo extends ReturnsSomething ? FuncInfo["returns"] : void>(name: T, handler: (parameters: FuncInfo extends HasParameters ? FuncInfo["parameters"] : never) => (HandlerReturnType | Promise<HandlerReturnType>)): void;
        register<T extends keyof JustParameterless<FunctionMap>, FuncInfo extends JustParameterless<FunctionMap>[T] = JustParameterless<FunctionMap>[T], HandlerReturnType extends FuncInfo extends ReturnsSomething ? FuncInfo["returns"] : void = FuncInfo extends ReturnsSomething ? FuncInfo["returns"] : void>(name: T, handler: () => (HandlerReturnType | Promise<HandlerReturnType>)): void;
    }

    type ProxyablePrimitive = number | string | Date | boolean | void | undefined;

    interface PrimitiveObject {
        [key: string]: PrimitiveObject | ProxyablePrimitive | Array<ProxyablePrimitive | PrimitiveObject> | ReadonlyArray<ProxyablePrimitive | PrimitiveObject>;
    }

    type ReturnsSomething<T = Proxyable | Promise<Proxyable>> = {
        returns: T;
    };

    type HasParameters<T = Proxyable> = {
        parameters: T;
    };

    type JustParameters<T> = Pick<T, ({ [P in keyof T]: T[P] extends HasParameters ? P : never })[keyof T]>;
    type JustParameterless<T> = Pick<T, ({ [P in keyof T]: T[P] extends HasParameters ? never : P })[keyof T]>;

    type ValidatedEntry<T> = T extends HasParameters & ReturnsSomething ? HasParameters<any> & ReturnsSomething<any> extends T ? T : never :
        T extends HasParameters ? HasParameters<any> extends T ? T : never :
        T extends ReturnsSomething ? ReturnsSomething<any> extends T ? T : never :
        T extends {} ? {} extends T ? T : never : never;

    type DetermineReturnType<FunctionMap, T extends keyof FunctionMap> = FunctionMap[T] extends ReturnsSomething ? FunctionMap[T]["returns"] extends Promise<any> ? FunctionMap[T]["returns"] : Promise<FunctionMap[T]["returns"]> : void;

    export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];
    export interface StringMap<T> {
        [key: string]: T;
    }
    export interface ReadonlyStringMap<T> {
        readonly [key: string]: T;
    }

    interface SimpleBladeReference {
        /**
         * The name of the extension that contains the Blade.
         */
        readonly extensionName: string;

        /**
         * The name of the Blade.
         */
        readonly bladeName: string;

        /**
         * A map of parameters to be passed to the Blade.
         */
        readonly parameters?: StringMap<any>;
    }

    /**
     * Primitive type which has numbers, strings, Dates, and booleans
     */
    export type Primitive = number | string | Date | boolean;

    /**
     * An object which only contains primitives, arrays of primitives or objects which contain the same.
     */
    export interface StringMapPrimitive extends Record<string, StringMapRecursive | Primitive | Array<Primitive | StringMapRecursive>> { }

    type StringMapRecursive = StringMapPrimitive;

    /**
     * The interface that represents an Arm event
     */
    export interface ArmEvent {
        /**
         * The operation name of the event.
         */
        operationName: string;

        /**
         * The source to match. Has to be an exact match.
         */
        source: string;

        /**
         * The status to match.
         */
        status: string;

        /**
         * The sub status to match.
         */
        subStatus?: string;

        /**
         * The event correlation id.
         */
        correlationId: string;

        /**
         * The asset id.
         */
        assetId?: string;

        /**
         * The event timestamp.
         */
        timestamp: Date;

        /**
         * Additional event properties
         */
        properties?: { [key: string]: string };

        /**
         * Set to true if this event is generated locally
         */
        isLocalEvent?: boolean;

        /**
         * Email id of user in case of server event.
         */
        caller?: string;
    }

    export namespace Image {
        /**
         * Custom image
         */
        export interface FxCustomImage {
            /**
             * Icon type (custom)
             */
            type: 0;

            /**
             * Custom icon data
             */
            data: string;
        }

        /**
         * Framework image
         */
        export interface FxImage {
            /**
             * Icon type
             */
            type: number;
        }
    }

    export namespace Images {
        /**
         * Data type used for rendering images's.
         */
        export type Image = {
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
        }

        export type ImageOptions = {
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
        }

        /**
         * Data type used for rendering a images's badge.
         */
        export type ImageBadge = {
            /**
             * Badge icon.
             */
            image: Image;

            /**
             * Override the default width, must be in a percentage ie (width: 10).
             */
            width?: number;
        }
    }

    export namespace ResourceManagement {
        /**
         * Data contract for a single location.
         */
        export interface Location {
            /**
             * The display name of the location.
             */
            displayName: string;

            /**
             * The fully qualified ID of the location.
             */
            id?: string;

            /**
             * The normalized name of the location.
             */
            name: string;

            /**
             * The display name of the location and its region.
             */
            regionalDisplayName: string;

            /**
             * Location metadata information
             */
            metadata: {
                /**
                 * The geography group of the location.
                 */
                geographyGroup?: string;

                /**
                 * The latitude of the location.
                 */
                latitude?: number | string;

                /**
                 * The longitude of the location.
                 */
                longitude?: number | string;

                /**
                 * The physical location of the location.
                 */
                physicalLocation?: string;

                /**
                 * The region category of the location.
                 */
                regionCategory: keyof typeof RegionSegment;

                /**
                 * The region type of the location.
                 */
                regionType: "Manifest" | "Physical" | "Logical";

                /**
                 * The paired region of the location.
                 */
                pairedRegion?: {
                    /**
                     * The id of the paired location.
                     */
                    id: string;

                    /**
                     * The normalized name of the paired location.
                     */
                    name: string;
                }[];
            };
        }

        /**
         * The enum for which recommended group a location should appear in
         */
        export const enum RegionSegment {
            /**
             * Service Provided
             */
            ServiceProvided = "ServiceProvided",
            /**
             * The first group and largest type of locations with the most resource types supported.
             */
            Recommended = "Recommended",
            /**
             * Other locations including RP specific locations
             */
            Other = "Other",
        }

        /**
         * Data contract for a single resource group.
         */
        export interface ResourceGroup {
            /**
             * Resource group id.
             */
            readonly id: string;

            /**
             * Resource group location.
             */
            readonly location: string;

            /**
             * Resource group name.
             */
            readonly name: string;

            /**
             * Resource group tags.
             */
            readonly tags?: ReadonlyStringMap<string>;

            /**
             * Resource group properties.
             */
            readonly properties?: {
                /**
                 * Resource group provisioning state.
                 */
                readonly provisioningState: string;
            };

            /**
             * The ID of the resource that manages this resource group.
             */
            readonly managedBy?: string;
        }

        /**
         * An ARM resource.
         */
        export interface ArmResource {
            /**
             * Resource id.
             */
            readonly id: string;

            /**
             * Resource location.
             */
            readonly location: string;

            /**
             * Resource name.
             */
            readonly name: string;

            /**
             * Resource tags.
             */
            readonly tags?: ArmResourceTags;

            /**
             * Resource properties.
             */
            readonly properties?: ArmResourcePropertyBag;

            /**
             * Resource group ID.
             */
            readonly resourceGroup?: string;

            /**
             * Resource type.
             */
            readonly type: string;

            /**
             * Resource kind.
             */
            readonly kind?: string;

            /**
             * Zone properties.
             */
            readonly zones?: ReadonlyArray<string>;

            /**
             * Plan properties.
             */
            readonly plan?: ArmResourcePropertyBag;

            /**
             * Managed by property.
             */
            readonly managedBy?: string;

            /**
             * SKU properties.
             */
            readonly sku?: ArmResourcePropertyBag;

            /**
             * Identity properties.
             */
            readonly identity?: ArmResourcePropertyBag;
        }

        /**
         * ARM resource tags.
         */
        export type ArmResourceTags = Readonly<Record<string, string>>;

        /**
         * ARM resource properties.
         */
        export type ArmResourcePropertyBag = Readonly<Record<string, any>>;

        /**
         * A resource that was recently accessed by the current user
         */
        export interface RecentResourceEntry {
            /**
             * The name of the entry.
             */
            readonly name: string;

            /**
             * The resource ID of the entry.
             */
            readonly resourceId: string;

            /**
             * The optional resource kind of the entry.
             */
            readonly resourceKind?: string;

            /**
             * The timestamp of the entry.
             */
            readonly timeStamp: number;
        }

        /**
         * The ARM ID kind enumeration.
         */
        // NOTE : These values are indexed and since this is a const enum, any additions MUST be made to the end
        //        of this enum. Adding values within the list will cause the IDs to change and cause runtime
        //        breaks. Conversely, don't remove values, simply leave them as obsolete.
        //        Additionally, when adding new values, please update/add to the kind maps below using the stringify()
        //        utility to ensure correctness.
        export const enum ArmIdKind {
            /**
             * Invalid ARM ID.
             */
            Invalid = 0,

            /**
             * Subscription ID.
             * eg: /subscriptions/{subscription}
             */
            Subscription,

            /**
             * Subscription provider ID.
             * This is a provider at the subscription level.
             * eg: /subscriptions/{subscription}/providers/{provider}
             */
            SubscriptionProvider,

            /**
             * Subscription resource ID. Can have nested type/ID pairs.
             * This is a resource at the subscription level.
             * eg: /subscriptions/{subscription}/providers/{provider}/{resourceTypes[n]}/{resourceIds[n]}
             */
            SubscriptionResource,

            /**
             * Resource group ID.
             * eg: /subscriptions/{subscription}/resourceGroups/{resourceGroup}
             */
            ResourceGroup,

            /**
             * Provider ID.
             * This is a provider at the resource group level.
             * eg: /subscriptions/{subscription}/resourceGroups/{resourceGroup}/providers/{provider}
             */
            Provider,

            /**
             * Resource ID. Can have nested type/ID pairs.
             * This is a resource at the resource group level.
             * eg: /subscriptions/{subscription}/resourceGroups/{resourceGroup}/providers/{provider}/{resourceTypes[n]}/{resourceIds[n]}
             */
            Resource,

            /**
             * Tenant provider ID.
             * This is a provider at the tenant level.
             * eg: /providers/{provider}
             */
            TenantProvider,

            /**
             * Tenant resource ID. Can have nested type/ID pairs.
             * This is a resource at the tenant level.
             * eg: /providers/{provider}/{resourceTypes[n]}/{resourceIds[n]}
             */
            TenantResource,

            /**
             * Subscription tag ID.
             * eg: /subscriptions/{subscription}/tagNames/{tagName}
             */
            SubscriptionTag,

            /**
             * Subscription tag value ID.
             * eg: /subscriptions/{subscription}/tagNames/{tagName}/tagValues/{tagValue}
             */
            SubscriptionTagValue,

            /**
             * Location ID.
             * eg: /subscriptions/{subscription}/locations/{location}
             */
            Location,
        }

        /**
         * The ARM ID interface.
         */
        export interface ArmId {
            /**
             * The kind of ARM ID.
             */
            readonly kind: ArmIdKind;

            /**
             * The subscription for the ARM ID.
             * Valid/required for these kinds:
             *      Subscription,
             *      SubscriptionProvider,
             *      SubscriptionResource,
             *      ResourceGroup,
             *      Provider,
             *      Resource,
             *      SubscriptionTag,
             *      SubscriptionTagValue
             */
            readonly subscription: string;

            /**
             * The resource group for the ARM ID.
             * Valid/required for these kinds:
             *      ResourceGroup,
             *      Provider,
             *      Resource
             */
            readonly resourceGroup: string;

            /**
             * The tag name for the ARM ID.
             * Valid/required for these kinds:
             *      SubscriptionTag,
             *      SubscriptionTagValue
             */
            readonly tagName: string;

            /**
             * The tag value for the ARM ID.
             * Valid/required for these kinds:
             *      SubscriptionTagValue
             */
            readonly tagValue: string;

            /**
             * The provider (namespace) for the ARM ID.
             * Valid/required for these kinds:
             *      SubscriptionProvider,
             *      SubscriptionResource,
             *      Provider,
             *      Resource,
             *      TenantProvider,
             *      TenantResource
             */
            readonly provider: string;

            /**
             * The collection of resource IDs for the ARM ID.
             * Valid/required for these kinds:
             *      SubscriptionResource,
             *      Resource,
             *      TenantResource
             *
             * @deprecated ArmId.resourceIds 05/06/2022 - Please use the ArmId.getResourceNames(armId) function instead.
             *
             * recipe: fullName = MsPortalFx.last(armId.resourceIds)
             *
             * becomes: fullName = MsPortalFx.last(ArmId.getResourceNamers(armId))
             *
             * Please refer to https://aka.ms/portalfx/breaking for more details.
             */
            readonly resourceIds?: ReadonlyArray<string>;

            /**
             * The collection of resource types for the ARM ID.
             * Valid/required for these kinds:
             *      SubscriptionResource,
             *      Resource,
             *      TenantResource
             *
             * @deprecated ArmId.resourceTypes 05/06/2022 - Please use the ArmId.getResourceTypes(armId) function instead.
             *
             * recipe: fullType = MsPortalFx.last(armId.resourceTypes)
             *
             * becomes: fullType = MsPortalFx.last(ArmId.getResourceTypes(armId))
             *
             * Please refer to https://aka.ms/portalfx/breaking for more details.
             */
            readonly resourceTypes?: ReadonlyArray<string>;

            /**
             * The collection of resource types for the ARM ID in nested form.
             * Valid/required for these kinds:
             *      SubscriptionResource,
             *      Resource,
             *      TenantResource
             */
            readonly nestedResourceTypes?: ReadonlyArray<{
                readonly provider: string;
                readonly resourceTypes: ReadonlyArray<string>;
            }>;

            /**
             * Flag which indicates that the resource type is a nested resource type.
             * Valid/required for these kinds:
             *      SubscriptionResource,
             *      Resource,
             *      TenantResource
             */
            readonly isNestedResourceType?: boolean;

            /**
             * The full resource name for the ARM ID.
             * Valid for these kinds:
             *      SubscriptionResource,
             *      Resource,
             *      TenantResource
             */
            readonly resourceName: string;

            /**
             * The fully qualified resource type for the ARM ID which includes the namespace (provider).
             * Valid for these kinds:
             *      SubscriptionResource,
             *      Resource,
             *      TenantResource
             *
             * IMPORTANT: This property includes the provider for the resource type as a prefix, eg: Microsoft.Sql/servers/databases
             *            To get the resource type without the provider, please use:
             *                     ArmId.getResourceTypeWithoutProvider(armId);
             *            which will return a string in the form like this (no provider): servers/databases
             */
            readonly resourceType: string;

        }

        /**
         * The browse blade reference options for getBrowseBladeReference API.
         */
        export interface BrowseBladeReferenceOptions {
            /**
             * The resource type for the browse blade reference.
             */
            resourceType: string;

            /**
             * Optional resource type kind for the browse blade reference.
             */
            kind?: string;

            /**
             * Optional flag to indicate the browse blade reference should be for an in-menu blade browse.
             */
            inMenu?: boolean;

            /**
             * Optional flag to ignore the browse deep link supplied by the extension and to force navigation to the FX/default browse blade.
             */
            ignoreDeepLink?: boolean;
        }

        /**
         * The dynamic dx blade reference options for the getDynamicDxBladeReference API.
         */
        export interface DynamicDxBladeReferenceOptions {
            /**
             * The blade name suffix for the view.
             */
            bladeNameSuffix: string;
        }

        /**
         * The dynamic dx blade reference for getDynamicDxBladeReference() API.
         */
        export interface DynamicDxBladeReference {
            /**
             * The blade name.
             */
            readonly bladeName: string;

            /**
             * The extension name for the blade
             */
            readonly extensionName: string;
        }

        /**
         * The resource type blade reference options for getResourceTypeBladeReference API.
         */
        export interface ResourceTypeBladeReferenceOptions {
            /**
             * The resource type for the blade reference.
             */
            readonly resourceType: string;
            /**
             * The referenced blade kind.
             */
            readonly kind: ResourceTypeBladeKind;
            /**
             * The parameters for the referenced blade.
             */
            readonly parameters: ResourceTypeBladeParameters[ResourceTypeBladeKind];
            /**
             * Optional flag to indicate the blade reference should be for an in-menu blade.
             */
            readonly inMenu?: boolean;
        }

        interface ResourceTypeBaseParameters {
            /**
             * Resource id of an ARM resource.
             */
            readonly id: string;
        }

        /**
         * Represents the resource type blade parameters for given blade reference kinds.
         */
        export interface ResourceTypeBladeParameters {
            /**
             * Properties Blade Kind.
             */
            readonly properties: ResourceTypeBaseParameters;
            /**
             * Overview Blade Kind.
             */
            readonly overview: ResourceTypeBaseParameters;
            /**
             *  CLI/PS Blade Kind.
             */
            readonly apiExplorer: ResourceTypeBaseParameters;
        }

        /**
         * The resource type blade reference kind
         */
        export type ResourceTypeBladeKind = keyof ResourceTypeBladeParameters;

        /**
         * ResourceInfo contains needed information for the essentials with resource id.
         */
        export interface ResourceInfo {
            /**
             * Resource group name.
             */
            readonly resourceGroupName: string;

            /**
             * Resource group Id.
             */
            readonly resourceGroupId: string;

            /**
             * Subscription Name.
             */
            readonly subscriptionName: string;

            /**
             * Subscription Id.
             */
            readonly subscriptionId: string;

            /**
             * Location.
             */
            readonly location: string;

            /**
             * Zones.
             */
            readonly zones?: ReadonlyArray<string>;

            /**
             * Tags.
             */
            readonly tags: TagInfo[];

            /**
             * Move resource options.
             */
            readonly moveOptions: {
                readonly resourceGroup: boolean;
                readonly subscription: boolean;
                readonly location: boolean;
            };
        }

        /**
         * Tags for a resource.
         */
        export interface TagInfo {
            /**
             * Key for the tag
             */
            readonly key: string;

            /**
             * Value for the tag
             */
            readonly value: string;
        }
    }

    export namespace Policy {
        /**
         * Reason for policy restriciton being applied to field
         */
        export interface PolicyRestrictionsResult {
            /**
             * A policy has denied this field as a valid value
             */
            Deny: "Deny";
            /**
             * A policy will remove this field on creation
             */
            Removed: "Removed";
            /**
             * A policy has required that this field be set
             */
            Required: "Required";
        }

        /**
         * The contract with the policy insights API endpoint
         */
        export interface PolicyCheckRequest {
            /**
             * The scope at which the policy check is being requested
             */
            scope?: string;
            /**
             * The property of the resource which will potentially be created
             */
            resourceDetails: {
                /**
                 * The property bag for the resource being created
                 */
                resourceContent?: {
                    /**
                     * The location of the resource being created
                     * ***THIS MUST BE SUPPLIED BEFORE THE POLICY REQUEST IS MADE***
                     */
                    location?: string,

                    /**
                     * The type of the resource being created
                     * ***THIS MUST BE SUPPLIED BEFORE THE POLICY REQUEST IS MADE***
                     */
                    type?: string,

                    /**
                     * The name of the resource being created
                     */
                    name?: string,
                } & StringMapPrimitive;
                /**
                 * The api version of the resource being created
                 * ***THIS MUST BE SUPPLIED BEFORE THE POLICY REQUEST IS MADE***
                 */
                apiVersion?: string;

                /**
                 * The scope at which the resource is being created
                 * ***THIS MUST BE SUPPLIED BEFORE THE POLICY REQUEST IS MADE***
                 */
                scope?: string;
            };
            /**
             * This is used for known possible values of different fields within the resourceContent
             * e.g. dropdown options to be disabled or marked
             */
            pendingFields: ({
                /**
                 * Maps to the fields inside of resourceContent
                 */
                field: string,
                /**
                 * The possible string values of those fields
                 */
                values?: string[],
            })[];
        }

        /**
         * The response for a policy check request.
         */
        export interface PolicyCheckResponse {
            /**
             * Array of restrictions that policy will place on properties of the resource.
             * This will include fields provided in the request's `pendingFields` AND
             * any properties that will be added/replaced/removed by `modify` and `append` effect policies.
             */
            readonly fieldRestrictions: {
                /**
                 * The name of the field that is being restricted.
                 * Tags will always be in the form `tags.{tagName}`.
                 * The tag name may contain additional `.` (period) characters.
                 */
                readonly field: string;
                /**
                 * The restrictions placed on the field
                 */
                readonly restrictions: {
                    /**
                     * `Deny` indicates a subset of values will be denied by policy.
                     * `Removed` indicates the field will be removed by policy. If the field is `tags` this indicates ALL tags will be removed.
                     * `Required` indicates the field is required by policy.
                     * This can either mean policy will provide a `defaultValue` for the field if it is not user provided OR that policy will replace any provided value with
                     * the value in `fieldRestrictions[*].restrictions[*].values
                     */
                    readonly result: keyof PolicyRestrictionsResult;
                    /**
                     * This is only provided in conjunction with a `result` of `Required`.
                     * This is the value that policy will set on the field if the user does not provide their own value.
                     */
                    readonly defaultValue?: string;
                    /**
                     * For a `result` of `Required` this indicates what values policy requires the field to be.
                     * For a `result` of `Deny` this indicates what values will be denied by policy.
                     */
                    readonly values: string[];
                    /**
                     * Contains the resource IDs of the [policy entities](https://docs.microsoft.com/azure/governance/policy/overview#azure-policy-objects)
                     * that are responsible for the restriction. REST APIs related to policy entities are described [here](https://docs.microsoft.com/rest/api/resources/policyassignments).
                     */
                    readonly policy: {
                        readonly policyDefinitionId: string;
                        readonly policyAssignmentId: string;
                        readonly policySetDefinitionId?: string;
                        readonly policyDefinitionReferenceId?: string;
                    };
                }[];
            }[];
            /**
             * Array of `deny` effect policies that will deny the creation of the `resourceContent` provided in the request.
             * This indicates that the known (i.e. non-pending) fields will cause the resource to be denied.
             */
            readonly contentEvaluationResult: {
                readonly policyEvaluations: {
                    /**
                     * Details of the policy that the resource is not compliant with.
                     */
                    readonly policyInfo: {
                        readonly policyAssignmentId: string;
                        readonly policyDefinitionId: string;
                        readonly policySetDefinitionId?: string;
                        readonly policyDefinitionReferenceId?: string;
                        readonly policySetDefinitionName: string;
                        readonly policySetDefinitionVersion?: string;
                        readonly policyDefinitionName: string;
                        readonly policyDefinitionVersion?: string;
                        readonly policyDefinitionEffect?: string;
                        readonly policyAssignmentName: string;
                        readonly policyAssignmentVersion?: string;
                        readonly policyAssignmentScope?: string;
                    };
                    /**
                     * This will always be `NonCompliant` in the `checkPolicyRestrictions` API since it only returns policies that will deny the `resourceContent`.
                     */
                    readonly evaluationResult: string;
                    /**
                     * Details about what conditions in the policy rule evaluated to `True`.
                     * The structure of this object matches what is available in the `Microsoft.PolicyInsights/policyStates`
                     * API described [here](https://docs.microsoft.com/rest/api/policy-insights/policystates/listqueryresultsforresource#policyevaluationdetails).
                     */
                    readonly evaluationDetails?: {
                        readonly result: boolean;
                        readonly expressionKind: string;
                        readonly expression: string;
                        readonly path: string;
                        readonly expressionValue: string;
                        readonly targetValue: string;
                        readonly operator: string;
                    };
                }[];
            };
        }

        /**
         * The option for converting values to fields for policy field validation
         * Contains a field that is optional if the value is a string
         */
        export interface ValueToField<TVal> {
            /**
             * Map control's value to the string being placed in the resource properties
             * If the control's value is set to string, then this will default to an identity function
             */
            valueToField?: (value: TVal) => string;
        }

        /**
         * Contract for the PendingValues options for creating a policy field validation
         */
        export type PendingValues<TVal> = {
            /**
             * The field which the pending values will be evaluated as
             */
            field: string;

            /**
             * Localize field name and value to put in validation string
             */
            fieldToDisplay?: (field: string, value: TVal, reason: keyof PolicyRestrictionsResult) => { displayField: string, displayValue?: string };

            /**
             * A function which returns the possible values for the field
             * This will run on validation and if any observables accessed in the values function passed in are modified
             * @default values returns an array that contains just the current value of the control
             */
            values?: () => TVal[];
        } & (TVal extends string ? ValueToField<TVal> : Required<ValueToField<TVal>>);

        /**
         * Contract for the PendingValues options for creating a policy field validation
         */
        export type PendingValuesGenerator<TVal> = (value: TVal) => PendingValues<TVal>[];

        /**
         * The contact for the policy validation factory to create a validation for a particular field
         */
        export interface FieldValidationOptions<TVal> {
            /**
             * A function which will be added to a sequence of functions that will create the resource details of the policy check request.
             * Upon validation, this will be run with the current value of the control to which this validation has been attached
             * @param details The details which are the result of any previous buildResourceDetail functions
             * @param value The current value of the control to which this validation is attached
             * @return The details which are a result of this function's modifications of the details passed in
             */
            buildResourceDetails: (details: PolicyCheckRequest["resourceDetails"], value: TVal) => PolicyCheckRequest["resourceDetails"] | {
                /**
                 *  The resulting resource details
                 */
                resourceDetails: PolicyCheckRequest["resourceDetails"],

                /**
                 * The scope at which the policy check request should be made
                 * Useful in the case that the resource group doesn't exists yet
                 * but this resource will be created a the resource group level
                 */
                requestScope: string;
            };

            /**
             * A function which will be added to a sequence of functions that will create the pending fields of the policy check request
             */
            pendingValues: PendingValues<TVal>;

            /**
             * A function which will be added to a sequence of functions that will create the pending fields of the policy check request
             */
            pendingValuesGenerator: PendingValuesGenerator<TVal>;
        }

        export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Common.AtLeastOne<T, U>;

        /**
         * The contact for the policy validation factory to create a validation for a particular field
         */
        export type CreateFieldValidationOptions<TVal> = AtLeastOne<FieldValidationOptions<TVal>>;

        /**
         * The contact for the policy validation factory to create a validation for a particular field
         */
        export type CreateFieldValidationWithTriggerOptions<TVal> = AtLeastOne<FieldValidationOptions<TVal>> & {
            /**
             * A callback to update validation of a control when other resource values
             * have changed and policy's might no longer be violated by this field.
             */
            triggerValidation: () => void;
        };

        /**
         * Options to supply to the policy validation factory
         */
        export interface Options {
            /**
             * A last step callback to modify anything about the policy check request
             * @param policyCheckRequest The result of all previous functions creating the policy check request
             * @returns The finalized policy check request
             */
            customizeRequest?: (policyCheckRequest: PolicyCheckRequest) => PolicyCheckRequest;
            /**
             * A callback to recieve the response from the policy check api.
             * @param policyCheckResponse The result of the call to the policy check api
             */
            onResponse?: (policyCheckResponse: PolicyCheckResponse) => void;
            /**
             * A callback to recieve the error response from the policy check api.
             * @param policyCheckError The result of the call to the policy check api
             */
            onError?: (policyCheckError: any) => void;
        }

        /**
         * Options for creating a child validation factory for another resource
         */
        export interface ChildFactoryOptions {
            /**
             * Should the existing build resource details be copied over
             * e.g. If the resource will be created under the same scope and you've already created
             * Subscription and ResourceGroup validations, set to true.
             */
            copyBuildResourceDetails?: boolean;
        }
    }

    export namespace PolicyDataCoreModels {
        /**
         * Value types supported by the Policy API.
         * For most cases, the value's item type will be string.
         * If you are using the 'ResourceTypeMetadataItemWithSubItem' type (the 'resourceTypeSubProperty' property),
         * then you would most likely be supplying a JSON object as a value, which would be parsed using the 'resourceTypeProperty' (propertyPath to the JSON obj) passed in.
         */
        export type ValueItemType = string | Record<string, any>;

        /**
         * Common properties across all ResourceTypeMetadata items
         */
        export type ResourceTypeMetadataItemCommon = {
            /**
             * The resource type
             * e.g."Microsoft.Storage/storageAccounts"
             */
            readonly resourceType: string;

            /**
             * API Version of the resource type
             * e.g. for storage it could be "2019-01-01"
             */
            readonly apiVersion: string;

            /**
             * The property of the resource type, for which the values are being supplied.
             * "properties.supportsHttpsTrafficOnly"
             */
            readonly resourceTypeProperty: string;
        };

        /**
         * ResourceTypeMetadata item
         */
        export type ResourceTypeMetadataItem = ResourceTypeMetadataItemCommon & {
            /**
             * 1. [Optional = Set to null/undefined/""] for root level properties documented here https://docs.microsoft.com/en-us/azure/governance/policy/concepts/definition-structure#fields
             *      i.e. name / tags / location / identity.type
             *      (Optional unless your resource type has alias defined for a root level property).
             *
             * 2. [Required] for nested properties not in the #1 list
             *      If this is not set, an expensive getAliases network call will be made to resolve the same.
             *      i.e. for "Microsoft.Storage/storageAccounts" properties.supportsHttpsTrafficOnly
             *      e.g.
             *          resourceTypePropertyAlias: "Microsoft.Storage/storageAccounts/supportsHttpsTrafficOnly"
             *
             *  https://docs.microsoft.com/en-us/azure/governance/policy/concepts/definition-structure#aliases
             */
            readonly resourceTypePropertyAlias: string;
        };

        /**
         * ResourceTypeMetadata Item with sub item
         * Sample: [
         *           {
         *               resourceType: "Microsoft.Compute/virtualMachines",
         *               resourceTypeProperty: "properties.storageProfile.ImageReference",
         *               apiVersion: "2020-06-01",
         *               resourceTypePropertyAlias: [
         *                   {
         *                       resourceTypeSubProperty: "publisher",
         *                       resourceTypePropertyAlias: "Microsoft.Compute/virtualMachines/imagePublisher",
         *                   },
         *                   {
         *                       resourceTypeSubProperty: "sku",
         *                       resourceTypePropertyAlias: "Microsoft.Compute/virtualMachines/imageSku",
         *                   },
         *                   {
         *                       resourceTypeSubProperty: "offer",
         *                       resourceTypePropertyAlias: "Microsoft.Compute/virtualMachines/imageOffer",
         *                   },
         *                   {
         *                       resourceTypeSubProperty: "version",
         *                       resourceTypePropertyAlias: "Microsoft.Compute/virtualMachines/imageVersion",
         *                   },
         *               ],
         *           },
         *       ]
         */
        export type ResourceTypeMetadataItemWithSubItem = ResourceTypeMetadataItemCommon & {
            /**
             * Subitem information
             * Sample:    [
             *         {
             *             resourceTypeSubProperty: "publisher",
             *             resourceTypePropertyAlias: "Microsoft.Compute/virtualMachines/imagePublisher",
             *         },
             *         {
             *             resourceTypeSubProperty: "sku",
             *             resourceTypePropertyAlias: "Microsoft.Compute/virtualMachines/imageSku",
             *         },
             * ]
             */
            readonly resourceTypePropertyAlias: ResourceTypeMetadataSubItem[];
        };

        /**
         * Subitem information
         * Sample:    [
         *         {
         *             resourceTypeSubProperty: "publisher",
         *             resourceTypePropertyAlias: "Microsoft.Compute/virtualMachines/imagePublisher",
         *         },
         *         {
         *             resourceTypeSubProperty: "sku",
         *             resourceTypePropertyAlias: "Microsoft.Compute/virtualMachines/imageSku",
         *         },
         * ]
         */
        export type ResourceTypeMetadataSubItem = {
            /**
             * The property path to the JSON object passed in as value
             */
            readonly resourceTypeSubProperty: string;

            /**
             * The corresponding alias to the property path passed in.
             */
            readonly resourceTypePropertyAlias: string;
        };

        /**
         * Options for the Evaluator APIs
         * For most cases, the Validator and Selector APIs would be used.
         * However, in some cases, when you have a custom scenario, for e.g. VMSizeSelector grid,
         * this API provides more flexibility by returning the raw Policy result for the UI to do more work, with more flexibility.
         */
        export type PolicyDataCoreOptions<PolicyItemType extends ValueItemType> = PolicyDataCoreOptionsCommon & {
            /**
             * Scope at which the policy checks should be performed
             * Provide either scopeId or resourceScopeId.
             */
            readonly scope: Scope;

            /**
             * Values the policy checks will be performed over
             */
            readonly resolvedValuesToField: PolicyItemType[];

            /**
             * Blade name to include in associated telemetry
             */
            readonly bladeName: string;
        };

        /**
         * The common set of properties across all policy APIs. (Validator, Selector and Evaluator)
         */
        export type PolicyDataCoreOptionsCommon = {
            /**
             * The resource type metadata information
             */
            readonly resourceTypeMetadata:
            | ResourceTypeMetadataItem
            | ResourceTypeMetadataItem[]
            | ResourceTypeMetadataItemWithSubItem;

            /**
             * To be set to true in cases where we would like to get the 'required' policy values.
             * i.e. pass in null and get what is required by policy in that environment, if any.
             * Default: false
             */
            readonly allowEmptyValues?: boolean;

            /**
             * Any additional metadata to be included in telemetry
             */
            readonly additionalTelemetry?: Record<string, any>;
        };

        /**
         * Scope at which the policy checks should be performed
         * Provide either scopeId or resourceScopeId.
         */
        export type Scope = {
            /**
             * In cases where the resource is not yet present, i.e. Creates, supply as 'scopeId' the scope of the deployment.
             * For e.g. `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}`
             */
            readonly scopeId?: string;

            /**
             * In cases where the resource is already present, i.e. Managed, supply as 'resourceScopeId' the resource scope.
             * For e.g. `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Storage/storageAccounts/${storageAccountName}`
             */
            readonly resourceScopeId?: string;
        };

        /**
         * Internal types (Used for function proxy typings only, not for consumption by extension authors)
         */
        export namespace Internal {
            /**
             * The result type from the PolicyDataCore Module.
             */
            export type PolicyDataCoreResult<PolicyItemType extends ValueItemType> = {
                /**
                 * Array of error results per Policy Assignment, and/or Policy Definition (in case of Policy Initiatives).
                 */
                readonly allErrorResults: PolicyDataCoreErrorResult[];

                /**
                 * Values 'denied' by the checkPolicy API (deny restrictions).
                 */
                readonly deniedValues: PolicyItemType[];

                /**
                 * Values 'allowed' by the checkPolicy API (required restrictions).
                 */
                readonly allowedValues: PolicyItemType[];
            };

            /**
             * Error result per Policy Assignment, and/or Policy Definition (in case of Policy Initiatives).
             */
            type PolicyDataCoreErrorResult = {
                /**
                 * ARM Id of the policy assignment that threw a policy restriction on the values passed in.
                 */
                readonly policyAssignmentId: string;
                /**
                 * ARM Id of the policy definition (normally used for Policy Initiatives) that threw a policy restriction on the values passed in.
                 */
                readonly policyDefinitionReferenceId?: string;

                /**
                 * String that represents the non-complaince reason property on the Policy Assignment.
                 * (For Policy Initiatives, we also use the referenceId to find an exact match, if multiple noncomplaince reasons are present).
                 * If one is not present, this is defaulted to the display name of the Policy Assignment.
                 */
                readonly reason: string;
            };

            export type PolicyDataCoreOptionsType = PolicyDataCoreOptions<string>;

            export type PolicyDataCoreResultType = PolicyDataCoreResult<string>;
        }
    }

    export namespace Ajax {
        /**
         * These interfaces are a way of creating a maintainable or string type
         * in combination with "keyof". This produces intellisense for apis.
         * e.g. "GET" | "HEAD" | "POST" | "PUT" | "DELETE"
         */
        interface BatchHttpMethods {
            GET: void;
            HEAD: void;
            POST: void;
            PUT: void;
            DELETE: void;
            PATCH: void;
        }
        /**
         * Http methods for batch ajax calls
         */
        type BatchHttpMethod = keyof BatchHttpMethods;
        /**
         * The request options.
         */
        const enum RequestOptions {
            /**
             * Default behavior.
             *    - Defaults to foreground request
             *    - Calls are sent directly to ARM without waiting for other requests
             *    - Any ServerTimeout (503) failures for foreground GET requests
             *      are automatically retried by calling the API directly without batch
             *    - Responses are not cached
             *    - Sending requests without delaying has been observed to improve performance,
             *      so requests no longer wait for other requests before executing
             */
            None = 0,
            /**
             * Make the batch call on the next tick.
             * DebounceNextTick takes precedence over Debounce100Ms.
             */
            DebounceNextTick = 1,
            /**
             * Include the request in a batch call that is made after a 100ms delay.
             * Debounce100Ms takes precedence over DebounceOneMinute
             */
            Debounce100ms = 2,
            /**
             * Sets this request to run in the background.
             * Background requests are batched every 60 seconds.
             */
            DebounceOneMinute = 4,
            /**
             * Forces a retry for any failure returned (statusCode >= 400) regardless of the HTTP method.
             */
            RetryForce = 8,
            /**
             * Skips the default retry.
             * SkipRetry takes precedence over ForceRetry if both are set.
             */
            RetrySkip = 16,
            /**
             * Caches the response for GET requests for 10 seconds.
             */
            ResponseCacheEnabled = 32,
            /**
             * Skips caching the response for GET requests.
             */
            ResponseCacheSkip = 64,
            /**
             * Skips retry when a forbidden gateway error is received.
             */
            RetrySkipOnForbidden = 128,
            /**
             * Sends the request directly to ARM without delaying.
             * DebounceImmediately takes precedence over DebounceNextTick
             */
            DebounceImmediately = 256,
        }
        /**
         * Endpoints used by most extensions.
         */
        type Endpoints = {
            /**
             * The AAD endpoint with a trailing slash.
             */
            readonly aadAuthority: string;
            /**
             * The ARM/CSM endpoint with a trailing slash.
             */
            readonly arm: string;
            /**
             * The absolute endpoint of the ARM/CSM batch endpoint with the API version included.
             */
            readonly armBatch: string;
            /**
             * The Graph endpoint with a trailing slash.
             */
            readonly graph: string;
            /**
             * The Microsoft Graph endpoint with a trailing slash.
             */
            readonly msGraph: string;
        };
        /**
         * The settings for the batch call.
         */
        type BatchSettings = {
            /**
             * The request options.
             */
            options?: RequestOptions | number;
            /**
             * An object to exclude or include status codes to force retry on the validate template ajax call.
             * If provided, options will have `RequestOptions.RetryForce` included.
             */
            retryStatusCodes?: {
                exclude: Ajax.BatchResponseItem<any>["httpStatusCode"][];
            } | {
                include: Ajax.BatchResponseItem<any>["httpStatusCode"][];
            };
            /**
             * The custom headers for a batch request
             */
            requestHeaderDictionary?: Record<string, string[]>;
            /**
             * The telemetry header to set.
             */
            setTelemetryHeader?: string;
            /**
             * The http method to use. Defaults to GET.
             */
            type?: BatchHttpMethod;
            /**
             * The URI to call.
             */
            uri: string;
            /**
             * Optional content to set for the requests.
             */
            content?: any;
            /**
             * Optional. If provided and true, a `responseHeaders` property will be included in the response as an instance of the browser Headers class.
             * DO NOT USE if the result will be proxied to another frame.
             */
            readonly includeResponseHeaders?: boolean;
        };
        /**
         * The contract for the batch settings.
         */
        type BatchMultipleSettings = {
            /**
             * The list of batch requests. All URIs have to be relative URIs in the request.
             */
            readonly batchRequests: ReadonlyArray<BatchRequest>;
            /**
             * The endpoint to make the request to.
             * If not specified, will use the ARM endpoint.
             */
            readonly endpoint?: string;
            /**
             * Determines whether the ajax request is part of a background task.
             * If true the batch request will be pushed on to the background queue.
             */
            readonly isBackgroundTask?: boolean;
            /**
             * Determines whether to append a telemetry header for the ARM calls.
             *
             * Set to a non-empty string to append the header. The value should be 60 characters or less and will be trimmed
             * if longer.
             */
            readonly telemetryHeader?: string;
            /**
             * Optionally include a `responseHeaders` property in the individual batch responses as instances of the browser Headers class.
             * DO NOT USE if the result will be proxied to another frame.
             */
            readonly includeResponseHeaders?: boolean;
        };
        /**
         * Response for a request within a batch.
         */
        type BatchResponseItem<T> = {
            /**
             * The response content. Can be success or failure.
             */
            readonly content: T;
            /**
             * The response headers as a simple object.
             */
            readonly headers: {
                [key: string]: string;
            };
            /**
             * The response headers as an instance of the browser Headers class. Only populared if `includeResponseHeaders` was true in batch options.
             */
            readonly responseHeaders?: Headers;
            /**
             * The response status code.
             */
            readonly httpStatusCode: number;
            /**
             * The name provided in the request.
             */
            readonly name?: string;
        };
        /**
         * Batch response.
         */
        type BatchResponse = {
            /**
             * The success response from ARM.
             */
            readonly responses: ReadonlyArray<BatchResponseItem<any>>;
        };
        /**
         * Individual batch request.
         */
        type BatchRequest = {
            /**
             * The URI to call.
             */
            readonly uri: string;
            /**
             * The http method for the call. Defaults to GET
             */
            readonly httpMethod?: BatchHttpMethod;
            /**
             * Optional request details.
             */
            readonly requestHeaderDetails?: {
                /**
                 * The command name.
                 */
                readonly commandName?: string;
            };
            /**
             * The custom headers for a batch request
            */
            readonly requestHeaderDictionary?: Record<string, string[]>;
            /**
             * The content to set on the request.
             */
            readonly content?: any;
        };

        /**
         * The HTTP status codes matches the .NET HttpStatusCode enumeration.
         */
        export const enum HttpStatusCode {
            Continue = 100,
            SwitchingProtocols = 101,

            Ok = 200,
            Created = 201,
            Accepted = 202,
            NonAuthoritativeInformation = 203,
            NoContent = 204,
            ResetContent = 205,
            PartialContent = 206,

            Ambiguous = 300,
            MultipleChoices = 300,
            Moved = 301,
            MovedPermanently = 301,
            Found = 302,
            Redirect = 302,
            RedirectMethod = 303,
            SeeOther = 303,
            NotModified = 304,
            UseProxy = 305,
            Unused = 306,
            RedirectKeepVerb = 307,
            TemporaryRedirect = 307,

            BadRequest = 400,
            Unauthorized = 401,
            PaymentRequired = 402,
            Forbidden = 403,
            NotFound = 404,
            MethodNotAllowed = 405,
            NotAcceptable = 406,
            ProxyAuthenticationRequired = 407,
            RequestTimeout = 408,
            Conflict = 409,
            Gone = 410,
            LengthRequired = 411,
            PreconditionFailed = 412,
            RequestEntityTooLarge = 413,
            RequestUriTooLong = 414,
            UnsupportedMediaType = 415,
            RequestedRangeNotSatisfiable = 416,
            ExpectationFailed = 417,
            UpgradeRequired = 426,
            TooManyRequests = 429,

            InternalServerError = 500,
            NotImplemented = 501,
            BadGateway = 502,
            ServiceUnavailable = 503,
            GatewayTimeout = 504,
            HttpVersionNotSupported = 505,
        }
    }

    export namespace Marketplace {
        /**
         * Contains special metadata used by the CreateLauncher to return alternate create flows or notice blades.
         */
        export interface AlternateCreateFlowOptions {
            /**
             * If an item supports an alternate stack, it tells the create launcher to return
             * the appropriate stack selection blade.
             */
            readonly useStackSelectionIfAvailable?: boolean;

            /**
             * If an item supports an external link, instead of returning a notice blade, the details blade will be used.
             * This is useful in scenarios like deep-linking where we should be redirecting the user instead of showing a coming soon blade.
             * Since we cannot redirect the user (framework limitation), the details blade will have the create button which will redirect them.
             */
            readonly useDetailsIfLinkable?: boolean;

            /**
             * The create flow will get started from a different point. For example the details blade.
             */
            readonly createLanding?: string;
        }

        /**
         * The context from which a marketplace create is kicked off.
         */
        export interface LaunchingContext extends Record<string, any> {

            /**
             * The gallery item id.
             */
            readonly galleryItemId: string;

            /**
             * The source entity launching the create flow (blade name, control, etc.). Used for telemetry logging.
             */
            readonly source: string[];

            /**
             * The marketplace menu item id.
             */
            readonly menuItemId?: string;

            /**
             * The marketplace sub menu item id.
             */
            readonly subMenuItemId?: string;

            /**
             * The blade instance id.
             */
            readonly bladeInstanceId?: string;

            /**
             * The telemetryId for launching the provisioning blade.
             */
            readonly telemetryId?: string;
        }

        /**
         * Blade reference options for provisioning blades
         */
        export interface MarketplaceOptions {
            /**
             * This is the marketplace id as listed by the gallery or catalog service.
             */
            readonly id: string;

            /**
             * Alternate create flow options.
             */
            readonly alternateCreateFlowOptions?: AlternateCreateFlowOptions;

            /**
             * Any additional config that is passed to the create blade.
             * This is mainly used by deep linking to pass input values to the create blade.
             */
            readonly additionalConfig?: StringMapPrimitive;

            /**
             * Additional information that is passed to log in case of errors.
             */
            readonly error?: {
                /**
                 * The extension attempting to launch the createflow
                 */
                readonly extension: string;

                /**
                 * The marketplace id attempted to launch
                 */
                readonly marketplaceItemId: string;
            };
            /**
             * The context from which a gallery create is kicked off.
             */
            readonly launchingContext: Pick<LaunchingContext, "source" | "bladeInstanceId" | "telemetryId">;
        }

        /**
         * Marketplace offer plan.
         */
        export interface OfferPlan {
            /**
             * The plan id.
             */
            planId: string;

            /**
             * The plan display name.
             */
            displayName: string;

            /**
             * The summary text for the plan.
             */
            summary: string;

            /**
             * The description HTML for the plan.
             */
            description: string;
        }

        /**
         * Marketplace offer pricing details model.
         * Used to retrieve the pricing information for a Marketplace offer.
         */
        export interface OfferPricingDetails {
            /**
             * The offer id.
             */
            offerId: string;

            /**
             * The publisher id.
             */
            publisherId: string;

            /**
             * The offer plans provided by the publisher.
             */
            plans: OfferPlan[];
        }

        /**
         * Marketplace product (offer).
         */
        export interface Product {
            /**
             * The product display name.
             */
            displayName: string;

            /**
             * The publisher display name.
             */
            publisherDisplayName: string;

            /**
             * The URI to the legal terms HTML.
             */
            legalTermsUri: string;

            /**
             * The URI to the privacy policy HTML.
             */
            privacyPolicyUri: string;

            /**
             * The other pricing details URI.
             */
            pricingDetailsUri: string;

            /**
             * The offer pricing details.
             */
            offerDetails?: OfferPricingDetails;
        }

        /**
         * Marketplace artifact.
         */
        export interface Artifact {
            /**
             * The artifact name.
             */
            name: string;

            /**
             * The URI to the artifact file.
             */
            uri: string;

            /**
             * The artifact type.
             */
            type: string;
        }

        /**
         * Marketplace item.
         */
        export interface Item<TUIMetaData> {
            /**
             * The Marketplace item id.
             */
            id: string;

            /**
             * The item display name.
             */
            itemDisplayName: string;

            /**
             * The publisher display name.
             */
            publisherDisplayName: string;

            /**
             * The Marketplace item version.
             */
            version: string;

            /**
             * The list of category ids the Marketplace item belongs to.
             */
            categoryIds: string[];

            /**
             * The products associated with the Marketplace item.
             */
            products: Product[];

            /**
             * Marketplace item products with no pricing information.
             */
            productsWithNoPricing: Product[];

            /**
             * The artifacts associated with the Marketplace item.
             */
            specialArtifacts?: Artifact[];

            /**
             * The dictionary of metadata properties to be used by the extension.
             */
            metadata?: StringMap<string>;

            /**
             * The deployment name.
             */
            deploymentName: string;

            /**
             * The list of URIs for the CSM template files.
             */
            deploymentTemplateFileUris: StringMap<string>;

            /**
             * The list of URIs for the deployment fragments.
             */
            deploymentFragmentFileUris?: StringMap<string>;

            /**
             * The context from which a marketplace create is kicked off.
             */
            launchingContext: Provisioning.LaunchingContext;

            /**
             * Properties contained in the UIDefinition.json for the marketplace item
             */
            uiMetadata: TUIMetaData;
        }

        /**
         * The interface of context supplied by marketplace
         */
        export interface Context<TUIMetaData> {
            /**
             * The telemetry id; a GUID unique to each instance of the provisioning flow initiated by
             * the user (i.e. unique to each instance when the blade is launched). The same id is used
             * when the 'CreateFlowLaunched, 'ProvisioningStart/Ended' and 'CreateDeploymentStart/End'
             * events are logged. Adding this telemetry id to the telemetry logged on the blade will
             * help you connect all the data points for a given provisioning instance.
             */
            readonly telemetryId: string;

            /**
             * The Marketplace item invoking the blade. Will be undefined if 'requiresMarketplaceId'
             * is set to false on the @DoesProvisioning decorator options.
             */
            readonly marketplaceItem?: Item<TUIMetaData>;

            /**
             * The resource group name passed into the gallery when new is selected from a resource group
             */
            readonly resourceGroupName?: string;
        }
    }

    export namespace Provisioning {
        interface LaunchingContext extends Marketplace.LaunchingContext {
            /**
             * The telemetry id for the provisioning blade launched
             */
            telemetryId: string;

            /**
             * The name of the create blade.
             */
            createBlade?: string;
        }
        /**
         * The template output.
         */
        interface TemplateOutput {
            /**
             * The type of the output.
             */
            type: string;
            /**
             * The value of the output.
             */
            value: any;
        }
        /**
         * The template resource.
         */
        interface TemplateResource {
            /**
             * The name of the resource.
             */
            name: string;
            /**
             * The type of the resource.
             */
            type: string;
            /**
             * The API version of the resource.
             */
            apiVersion: string;
            /**
             * The location of the resource.
             */
            location: string;
            /**
             * The resource properties.
             */
            properties?: StringMap<any>;
            /**
             * The dependencies for this resource.
             */
            dependsOn?: string[];
            /**
             * The tags on the resource.
             */
            tags?: StringMap<string>;
            /**
             * Comments on the resource.
             */
            comments?: string;
            /**
             * The child resources.
             */
            resources?: TemplateResource[];
            /**
             * The resource id. Only includes in the validation response.
             */
            id?: string;
        }
        /**
         * The response that ARM returns when a template validate call succeeds.
         */
        interface TemplateValidationResponse {
            /**
             * Deployment id.
             */
            id: string;
            /**
             * Deployment name.
             */
            name: string;
            /**
             * Deployment properties.
             */
            properties: {
                /**
                 * Correlation id associated with the validate call.
                 */
                correlationId: string;
                /**
                 * Duration of validation.
                 */
                duration: string;
                /**
                 * Deployment mode.
                 */
                mode: string;
                /**
                 * Parameters passed to the validate call.
                 */
                parameters: StringMap<TemplateOutput>;
                /**
                 * Correlation id associated with the validate call.
                 */
                provisioningState: string;
                /**
                 * The timestamp.
                 */
                timestamp: string;
                /**
                 * The list of resources that are in the template.
                 */
                validatedResources: TemplateResource[];
            };
        }
        /**
         * The template deployment operation mode.
         */
        /**
         * Initial values for form initialization. Use those values to initialize the subscription,
         * resource group, and location drop down controls.
         */
        export interface InitialValues {
            /**
             * The list of subscription ids last used by the user.
             */
            readonly subscriptionIds?: string[];
            /**
             * The list of location names last used by the user.
             */
            readonly locationNames?: string[];
            /**
             * The list of resource group names last used by the user.
             */
            readonly resourceGroupNames?: string[];
        }

        /**
         * Options for validating the form prior to sending the preflight validation request to ARM.
         */
        export interface FormValidationOptions {
            /**
             * Explicitly prevent form validation.
             */
            readonly validateForm?: boolean;
            /**
             * Focus the first invalid control on the form. Defaults to false.
             */
            readonly focusOnFirstInvalid?: boolean;
            /**
             * Whether or not to validate hidden controls on the form. Defaults to true.
             */
            readonly validateHidden?: boolean;
        }

        /**
         * Options for the DeployTemplate method on provisioning context
         */
        export interface DeployTenantLevelTemplateOptions {
            /**
             * The deployment name.
             */
            deploymentName: string;
            /**
             * The resource id. Supply this to link the notifications to the asset or if the deployment
             * results in a startboard part.
             */
            resourceId?: string;
            /**
             * The asset type associated with the deployment. Used to customize the post-provisioning experience.
             */
            readonly assetType?: string;
            /**
             * The context from which a gallery create is kicked off. Used for telemetry logging.
             */
            launchingContext?: Common.Marketplace.LaunchingContext;
            /**
             * Debug info.
             */
            debug?: string;
            /**
             * An array of the resource providers to be registered for the subscription.
             */
            resourceProviders: string[];
            /**
             * The parameters for the template deployment (name and value pairs).
             */
            parameters?: StringMapPrimitive;
            /**
             * The reference parameters for the template deployment.
             */
            referenceParameters?: StringMap<StringMapPrimitive>;
            /**
             * The URI for the parameters file. Use this to link to an existing parameters file. Specify
             * this or the parameters and/or referenceParameters properties, but not both.
             */
            parametersLinkUri?: string;
            /**
             * The URI for the ARM template. Specify this or the templateJson property, but not both.
             * This will be deprecated soon, use templateLink.uri
             */
            templateLinkUri?: string;
            /**
             * The link to the ARM template. Specify this or the templateJson property, but not both.
             */
            templateLink?: {
                /**
                 * The URI of the template to deploy. Use either the uri or id property, but not both.
                 */
                uri?: string;
                /**
                 * The resource id of a Template Spec. Use either the id or uri property, but not both.
                 */
                id?: string;
                /**
                 * Applicable only if this template link references a Template Spec.
                 * This relativePath property can optionally be used to reference a
                 * Template Spec artifact by path.
                 */
                relativePath?: string;
            };
            /**
             * The inline deployment template JSON. Specify this or the templateLinkUri property, but not both.
             */
            templateJson?: string;
            /**
             * The template deployment operation mode. Defaults to 'RequestDeploymentOnly'.
             */
            deploymentMode?: TemplateDeploymentMode;
            /**
             * Flag indicating that we should run ARM's preflight validation before submitting the template
             * deployment request to ARM. Defaults to false.
             */
            validateTemplate?: boolean;
            /**
             * An object to exclude or include httpStatusCodes for retry
             */
            validateRetry?: { exclude: Ajax.BatchResponseItem<any>["httpStatusCode"][] } | { include: Ajax.BatchResponseItem<any>["httpStatusCode"][] };
            /**
             * The result of validating the template with ARM.
             */
            validationResult?: TemplateValidationResponse;
            /**
             * Options for validating the form before ARM validation.
             * This validation is enabled by default and can be disabled by setting validateForm = false in this property.
             */
            formValidationOptions?: FormValidationOptions;
            /**
             * The marketplaceId of the resource.
             */
            readonly marketplaceItemId?: string;
            /**
             * A key or hash that encodes or corresponds to information about the provisioning request.
             */
            readonly provisioningHash?: string;
            /**
             * Function to provide a part reference based on the resourceId of a deployment.
             * Defaults to the part reference provided by the marketplace UI.Definition file
             * or null if no marketplace item was provided to this provisioning blade.
             *
             * @param resourceId The resourceId of the resource created
             */
            supplyPartReference?(resourceId: string): any; //PartReference<any>;
        }

        /**
         * Defines how resources deployed by the deployment stack are locked.
         */
        export const enum DenySettingsMode {
            /**
             * Authorized users are able to read and modify the resources, but cannot delete.
             */
            DenyDelete = "denyDelete",
            /**
             * Authorized users can only read from a resource, but cannot modify or delete it.
             */
            DenyWriteAndDelete = "denyWriteAndDelete",
            /**
             * No deny assignments have been applied.
             */
            None = "none",
        }

        /**
         * Options for the DeployTemplate method on provisioning context
         */
        export interface DeployStackOptions {
            /**
             * The deployment name.
             */
            readonly stackName: string;
            /**
             * The scope at which the stack will be deployed
             */
            readonly scope: string;
            /**
             * The resource id. Supply this to link the notifications to the asset or if the deployment
             * results in a startboard part.
             */
            readonly primaryResourceId: string;
            /**
             * An array of the resource providers to be registered for the subscription.
             */
            readonly resourceProviders: string[];
            /**
             * Defines the behavior of resources removed in incremental deployments of the stack.
             * @deprecated Use actionOnUnmanage
             */
            readonly updateBehavior?: StackUpdateBehavior;
            /**
             * Defines the behavior of resources that are not managed immediately after the stack is updated.
             */
            readonly actionOnUnmanage?: Record<"resources" | "resourceGroups" | "managementGroups", ActionOnUnmanage>;
            /**
             * The location/region name to set as the last used location, and will be used as a default in subsequent
             * create experiences for the user. This is optional in a resource group level deployment, but required
             * for all other deployment scopes. Will also be used to set location for any resource groups created in this
             * deployment if resourceGroupLocation is not provided.
             */
            readonly location: string;
            /**
             * The marketplaceId of the resource.
             */
            readonly marketplaceItemId?: string;
            /**
             * A key or hash that encodes or corresponds to information about the provisioning request.
             */
            readonly provisioningHash?: string;
            /**
             * The asset type associated with the deployment. Used to customize the post-provisioning experience.
             */
            readonly assetType?: string;
            /**
             * "The scope at which the initial deployment should be created.
             * If a scope is not specified, it will default to the scope of the deployment stack.
             * Valid scopes are: management group (format: '/providers/Microsoft.Management/managementGroups/{managementGroupId}'),
             * subscription (format: '/subscriptions/{subscriptionId}'),
             * resource group (format: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}')."
             */
            readonly deploymentScope?: string;
            /**
             * Deployment stack description.
             */
            readonly description?: string;
            /**
             * The parameters for the deny settings to define how resources deployed by the deployment stack are locked.
             */
            readonly denySettings?: {
                /**
                 * Defines how resources deployed by the deployment stack are locked.
                 */
                readonly mode: DenySettingsMode;
                /**
                 * List of AAD object IDs excluded from the deny assignments lock. Up to 5 principals are permitted.
                 */
                readonly excludedPrincipals: string[];
                /**
                 * List of role-based management operations that are excluded from the deny settings. Up to 200 actions are permitted.
                 * If the denySettings mode is set to 'denyWriteAndDelete', then the following actions are automatically appended to 'excludedActions': '*\/read' and 'Microsoft.Authorization/locks/delete'.
                 * If the denySettings mode is set to 'denyDelete', then the following actions are automatically appended to 'excludedActions': 'Microsoft.Authorization/locks/delete'.
                 * Duplicate actions will be removed.
                 */
                readonly excludedActions: string[];
                /**
                 * Indicates whether the deny settings will be applied to child scopes.
                 */
                readonly applyToChildScopes: boolean;
            };
            /**
             * The context from which a gallery create is kicked off. Used for telemetry logging.
             */
            launchingContext?: Common.Provisioning.LaunchingContext;
            /**
             * The parameters for the template deployment (name and value pairs).
             */
            parameters: {
                /**
                 * The URI of the template to deploy. Use either the uri or id property, but not both.
                 */
                readonly uri: string;
            } | {
                /**
                 * The parameters which will be sent as json
                 */
                readonly json: StringMapPrimitive
            };
            /**
             * The link to the ARM template or the template used for
             */
            template: {
                /**
                 * The URI of the template to deploy.
                 */
                readonly uri: string;
            } | {
                /**
                 * The resource id of a Template Spec.
                 */
                readonly id: string;
            } | {
                /**
                 * The template which will be sent as json
                 */
                readonly json: StringMapPrimitive
            };
        }

        /**
         * Options for the DeployTemplate method at resource group level on provisioning context
         */
        export type DeployTemplateOptions = DeployTenantLevelTemplateOptions & {
            /**
             * The subscription id.
             */
            subscriptionId: string;
            /**
             * The resource group name.
             */
            resourceGroupName: string;
        } & AtLeastOne<{

            /**
             * The location/region to deploy a resource group being created for this deployment.
             * This will also be set as the user's last used location if location is not provided.
             */
            resourceGroupLocation: string;
            /**
             * The location/region name to set as the last used location, and will be used as a default in subsequent
             * create experiences for the user. This is optional in a resource group level deployment, but required
             * for all other deployment scopes. Will also be used to set location for any resource groups created in this
             * deployment if resourceGroupLocation is not provided.
             */
            location: string;
        }>


        /**
         * Options for the DeployTemplate method at subscription level on provisioning context
         */
        export interface DeploySubscriptionLevelTemplateOptions extends DeployTenantLevelTemplateOptions {
            /**
             * The subscription id.
             */
            subscriptionId: string;
            /**
             * The location/region if this is a subscription level resource.
             */
            location: string;
        }

        /**
         * Options for the DeployTemplate method at subscription level on provisioning context
         */
        export interface DeployManagementGroupLevelTemplateOptions extends DeployTenantLevelTemplateOptions {
            /**
             * The managementGroup id.
             */
            managementGroupId: string;

            /**
             * The location/region if this is a managementGroup level resource.
             */
            location: string;
        }

        export type AllDeployTemplateOptions = DeployTemplateOptions | DeploySubscriptionLevelTemplateOptions | DeployTenantLevelTemplateOptions;

        /**
         * ARM template deployment operation.
         */
        export interface TemplateDeploymentOperationProperties {
            /**
             * The resource being operated upon.
             */
            targetResource: StringMap<string>;
            /**
             * The timestamp when the operation was completed.
             */
            timestamp: string;
            /**
             * The unique id for this deployment operation.
             */
            trackingId: string;
            /**
             * The status of the operation.
             */
            statusCode: string;
            /**
             * The detailed status message for the operation returned by the resource provider.
             */
            statusMessage: string;
        }
        /**
         * ARM template deployment operation.
         */
        export interface TemplateDeploymentOperation {
            /**
             * The URI for the deployed entity.
             */
            id: string;
            /**
             * The operation id.
             */
            operationId: string;
            /**
             * The operation properties.
             */
            properties: TemplateDeploymentOperationProperties;
        }
        export interface BaseDeployResults {
            /**
             * The deployment status code.
             */
            deploymentStatusCode: DeploymentStatusCode;
            /**
             * The correlation id (aka tracking id).
             */
            correlationId: string;
            /**
             * The provisioning state.
             */
            provisioningState: string;
            /**
             * The timestamp when the operation was completed.
             */
            timestamp: Date;
            /**
             * The list of deployment operations.
             */
            operations?: TemplateDeploymentOperation[];
            /**
             * Timestamp when the deployment request was initiated.
             */
            requestTimestamp?: Date;
        }
        export type DeployTemplateResults<TOptions extends AllDeployTemplateOptions> = BaseDeployResults & TOptions;
        export type DeployStackResults<TOptions extends DeployStackOptions> = BaseDeployResults & TOptions;

        /**
         * Options for the DeployCustom method on provisioning context
         */
        export interface DeployCustomOptions<TResult> {
            /**
             * A promise for when provisioning has finished
             */
            provisioningPromise: Promise<TResult>;
        }

        export interface Provisioning<TUIMetadata> extends Common.Marketplace.Context<TUIMetadata> {
            /**
             * Initial values for form initialization. Use those values to initialize the subscription,
             * resource group, and location drop down controls.
             */
            readonly initialValues: InitialValues;
            /**
             * Validates an ARM template and returns a promise for the validation result.
             * @param options Template deployment options
             */
            validateTemplate<TOptions extends AllDeployTemplateOptions = DeployTemplateOptions>(options: TOptions): Promise<TOptions>;
            /**
             * Deploy a template to ARM and receive a promise for a deployment result
             * @param options Template deployment options
             */
            deployTemplate<TOptions extends AllDeployTemplateOptions = DeployTemplateOptions>(options: TOptions): Promise<DeployTemplateResults<TOptions>>;
            /**
             * Deploy a template to ARM and receive a promise for a deployment result
             * @param options Template deployment options
             */
            deployStack(options: DeployStackOptions): Promise<DeployStackResults<DeployStackOptions>>;
            /**
             * Deploy a template to ARM and receive a promise for a deployment result
             * @param options Template deployment options
             * @returns a promise that resolves to the requested marketplace item
             */
            setMarketplaceId(options: string): Promise<Marketplace.Item<TUIMetadata>>;
            /**
             * Get a blade reference to the template viewer blade
             * @param options Template deployment options
             */
            getAutomationBladeReference<TOptions extends AllDeployTemplateOptions = DeployTemplateOptions>(options: TOptions): Promise<SimpleBladeReference>;
            /**
             * Get a blade reference to the Arm Errors blade
             * @param bladeParameters Parameters passed to the arm errors blade
             */
            getArmErrorsBladeReference(bladeParameters: ArmErrorsBladeParameters): Promise<SimpleBladeReference>;
            /**
             * Deploy a template to ARM and receive a promise for a deployment result
             * @param options Custom deployment options
             */
            deployCustom<TResult>(options: DeployCustomOptions<TResult>): Promise<TResult>;
        }

    }
    type DeployTemplateOptions = Provisioning.DeployTemplateOptions;
    type TemplateOutput = Provisioning.TemplateOutput
    type TemplateResource = Provisioning.TemplateResource
    type TemplateValidationResponse = Provisioning.TemplateValidationResponse
    type InitialValues = Provisioning.InitialValues
    type FormValidationOptions = Provisioning.FormValidationOptions
    type DeployTenantLevelTemplateOptions = Provisioning.DeployTenantLevelTemplateOptions
    type DeployStackOptions = Provisioning.DeployStackOptions
    type DeploySubscriptionLevelTemplateOptions = Provisioning.DeploySubscriptionLevelTemplateOptions
    type DeployManagementGroupLevelTemplateOptions = Provisioning.DeployManagementGroupLevelTemplateOptions
    type TemplateDeploymentOperationProperties = Provisioning.TemplateDeploymentOperationProperties
    type TemplateDeploymentOperation = Provisioning.TemplateDeploymentOperation
    type BaseDeployResults = Provisioning.BaseDeployResults
    type DeployCustomOptions<TResults> = Provisioning.DeployCustomOptions<TResults>
    type Provisioning<TUIMetadata> = Provisioning.Provisioning<TUIMetadata>
    type AllDeployTemplateOptions = Provisioning.AllDeployTemplateOptions;
    type DeployTemplateResults<TOptions extends Common.Provisioning.AllDeployTemplateOptions> = Provisioning.DeployTemplateResults<TOptions>;
    type DeployStackResults<TOptions extends Common.Provisioning.DeployStackOptions> = Provisioning.DeployStackResults<TOptions>;

    /**
     * Defines the behavior of resources that are not managed immediately after the stack is updated.
     * @deprecated Use ActionOnUnmanage
     */
    export const enum StackUpdateBehavior {
        /**
         * Remove the resource from the stack but keep the resource in Azure
         */
        DetachResources = "DetachResources",
        /**
         * Remove the resource from the stack and remove the resource from Azure
         */
        PurgeResources = "PurgeResources",
    }

    /**
     * Defines the behavior of resources that are not managed immediately after the stack is updated.
     */
    export const enum ActionOnUnmanage {
        /**
         * Remove the resource from the stack but keep the resource in Azure
         */
        Delete = "delete",

        /**
         * Remove the resource from the stack and remove the resource from Azure
         */
        Detach = "detach",
    }

    /**
     * The template deployment operation mode. Defaults to 'RequestDeploymentOnly'.
     */
    const enum TemplateDeploymentMode {
        /**
         * Submit a deployment request to ARM only (this does not wait till the resources are provisioned).
         * The 'deployTemplate' API will return a promise that resolves with ARM's response to the request.
         */
        RequestDeploymentOnly = 1,
        /**
         * Submit a deployment request to ARM and wait till provisioning the resources has completed
         * (silent polling). The 'deployTemplate' API will return a promise that reports progress only
         * once, when the request is accepted. The promise resolves when provisioning the resources
         * has completed.
         */
        DeployAndAwaitCompletion = 2,
        /**
         * Submit a deployment request to ARM and wait till provisioning the resources has completed,
         * while reporting all updates from ARM. The 'deployTemplate' API will return a promise that
         * reports progress when the request is accepted, followed by all ARM operations on every poll.
         * The promise resolves when provisioning the resources has completed.
         */
        DeployAndGetAllOperations = 3,
        /**
         * Execute all the deployment preflight actions without submitting the deployment request
         * (sanity check, provisioning the resource group, registering the resource providers,
         * getting a valid deployment name, and running ARM's preflight validation).
         */
        PreflightOnly = 4,
    }

    /**
     * Status codes for the deployment in being provisioned.
     */
    export const enum DeploymentStatusCode {
        /**
         * Template preflight, validation or deployment failure (based on the operation performed).
         */
        Failure = -1,
        /**
         * Deployment was accepted or successful (based on the operation performed).
         */
        Success = 0,
        /**
         * ARM rejected the deployment request.
         */
        DeploymentRequestFailed = 1,
        /**
         * Deployment failed.
         */
        DeploymentFailed = 2,
        /**
         * Deployment status unknown.
         */
        DeploymentStatusUnknown = 3,
        /**
         * An unexpected error occurred while provisioning the resource group.
         */
        ErrorProvisioningResourceGroup = 4,
        /**
         * An unexpected error occurred while submitting the deployment request.
         */
        ErrorSubmittingDeploymentRequest = 5,
        /**
         * An unexpected error occurred while getting the deployment status.
         */
        ErrorGettingDeploymentStatus = 6,
        /**
         * Invalid arguments.
         */
        InvalidArgs = 7,
        /**
         * An unexpected error occurred while registering the resource providers.
         */
        ErrorRegisteringResourceProviders = 8,
        /**
         * Deployment canceled.
         */
        DeploymentCanceled = 9,
        /**
         * Unknown error.
         */
        UnknownError = 10,
    }

    /**
     * Troubleshooting links for the arm errors blade
     */
    const enum TroubleshootingLinks {
        /**
         * Common Azure deployment errors
         */
        CommonDeploymentErrors = 0,
        /**
         * Move resources documentation
         */
        ResourceMoveDocs = 1,
        /**
         * Create ARM template documents
         */
        CreateArmTemplateDocs = 2,
    }

    /**
     * The input parameters for the arm errors blade.
     */
    interface ArmErrorsBladeParameters {
        /**
         * The errors object from ARM.
         */
        readonly errors: any;
        /**
         * The subscriptionId for the resource with an ARM error.
         * This is used to create a link to the quotas for the subscription.
         */
        readonly subscriptionId?: string;
        /**
         * The array of links to display in the "Troubleshooting links" section.
         */
        readonly troubleshootingLinks?: ReadonlyArray<TroubleshootingLinks>;
    }

    export namespace AssetTypes {
        /**
         * Asset type options for the AssetType 'options' property.
         */
        export const enum AssetTypeOptions {
            /**
             * The asset type does not provide any options.
             */
            NoOptions = 0,

            /**
             * The asset type is hidden from the browse menu, search and the resource filter types.
             */
            HideAssetType = 1,

            /**
             * The asset type's instances (actual resources) are by default hidden from the browse resource list and search results.
             */
            HideInstances = 2,

            /**
             * The asset type is shown in the browse menu, search and the resource filter types. This is used for kinds to override the parent asset type.
             */
            ShowAssetType = 4,

            /**
             * The asset type's instances (actual resources) are by default shown from the browse resource list and search results. This is used for kinds to override the parent asset type.
             */
            ShowInstances = 8,

            /**
             * The asset type's is disabled.
             */
            DisableAssetType = 16,
        }

        /**
         * Browse type for the AssetType 'browseType' property.
         */
        export const enum BrowseType {
            /**
             * Use the service view model (browse V1).
             *
             * @deprecated Fx.Assets.BrowseType.ServiceViewModel Browse V1 is no longer supported and at this point is not used by any teams
             *
             * Please refer to https://aka.ms/portalfx/breaking for more details.
             */
            ServiceViewModel = 0,

            /**
             * Use the resource type for browse.
             */
            ResourceType = 1,

            /**
             * Use the asset type blade for browse.
             */
            AssetTypeBlade = 2,

            /**
             * Service link into the classic portal for a service.
             */
            ServiceLink = 3,

            /**
             * Instance link into the classic portal for an instance of a service.
             *
             * @deprecated Fx.Assets.BrowseType.InstanceLink Instance link browse is no longer supported and at this point is not used by any teams
             *
             * Please refer to https://aka.ms/portalfx/breaking for more details.
             */
            InstanceLink = 4,

            /**
             * The asset type does not support browse (used only in typescript).
             */
            NoBrowse = -1,
        }

        /**
         * The routing type for the AssetType 'routingType' property.
         */
        export enum ResourceRoutingType {
            /**
             * Default routing type, resource-group level tracked resources.
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
             * Provider proxy (untracked) based resources.
             */
            ProviderProxy = 3,
        }

        /**
         * The resource type kind metadata.
         */
        export interface ResourceTypeKind {
            /**
             * The name of the resource type kind.
             */
            readonly name: string;

            /**
             * The is default flag of the resource type kind.
             */
            readonly isDefault?: boolean;

            /**
             * Optional browse type which indicates the type of browse for the asset type.
             */
            readonly options?: AssetTypeOptions;

            /**
             * The singular display name of the resource type kind.
             */
            readonly singularDisplayName?: string;

            /**
             * The plural display name of the resource type kind.
             */
            readonly pluralDisplayName?: string;

            /**
             * The lowercase singular display name of the resource type kind.
             */
            readonly lowerSingularDisplayName?: string;

            /**
             * The lowercase plural display name of the resource type kind.
             */
            readonly lowerPluralDisplayName?: string;

            /**
             * The service display name of the resource type kind.
             */
            readonly serviceDisplayName?: string;

            /**
             * The blade associated with the resource type kind.
             */
            readonly bladeName?: string;

            /**
             * The blade extension associated with the resource type kind.
             */
            readonly bladeExtensionName?: string;

            /**
             * Name of part to use for pinning
             */
            readonly partName?: string;

            /**
             * Name of the extension that contains the part
             */
            readonly partExtensionName?: string;

            /**
             * The icon of the resource type kind.
             * FxImage format.
             */
            readonly icon?: (Image.FxCustomImage | Image.FxImage);

            /**
             * If this flag is true visual artifacts are displayed in the asset's parts and blades to indicate the functionality is preview.
             */
            readonly isPreview?: boolean;

            /**
             * If this flag is true visual artifacts are displayed in the asset's parts and blades to indicate the functionality is disabled by policy.
             */
            readonly isDisable?: boolean;

            /**
             * The is use resource menu flag of the resource type kind.
             */
            readonly useResourceMenu?: boolean;

            /**
             * The list of keywords.
             * NOTE: comma separated list.
             */
            readonly keywords?: string;

            /**
             * The kinds (for filtering) for the kind.
             */
            readonly kinds?: ReadonlyArray<string>;

            /**
             * The filter map for the kind.
             */
            readonly filterMap?: ReadonlyStringMap<boolean>;
        }

        /**
         * ARM browse options for the AssetType 'argBrowseOptions' property.
         */
        export const enum ArmBrowseOptions {
            /**
             * Allows ARM browse fallback (ARM browse when no ARG support, ARG fallback blade, ARG simplified view blade).
             */
            AllowFallback = 0,

            /**
             * Disables ARM browse fallback (ARM browse when no ARG support, ARG fallback blade, ARG simplified view blade).
             */
            NoFallback = 1,
        }

        /**
         * ARG browse options for the AssetType 'argBrowseOptions' property.
         */
        export const enum ArgBrowseOptions {
            /**
             * Allows users to opt in/out of the new experience but will default to the old experience.
             * This will show a 'Try preview' button on the old browse blade
             * and an 'Opt out of preview' button on the ARG browse blade
             *
             * @deprecated Eventually we need to remove this, for now it remaps to 'ForceOptIn' when loading manifests
             */
            AllowOptIn = 1,

            /**
             * Allows users to opt in/out of the new experience but will default to the new experience.
             * This will show a 'Try preview' button on the old browse blade
             * and an 'Opt out of preview' button on the ARG browse blade
             */
            ForceOptIn = 2,

            /**
             * This will force users to the new experience.
             * There wil be no 'Opt out of preview' button on the ARG browse blade
             */
            Force = 3,

            /**
             * This will force users to the old experience. This is the default experience if not flags are set.
             * There wil be no 'Try preview' button on the ARG browse blade
             */
            Disable = 4,
        }

        /**
         * The asset type describes the asset type metadata for a given asset type.
         */
        export interface AssetType {
            /**
             * The extension name for the fully qualified asset type.
             */
            readonly extensionName: string;

            /**
             * The asset type for the fully qualified asset type.
             */
            readonly assetType: string;

            /**
             * The asset type's icon image.
             * FxImage format.
             */
            readonly icon: (Image.FxCustomImage | Image.FxImage);

            /**
             * The asset type's display name.
             */
            readonly compositeDisplayName: {
                /**
                 * The singular, formal-cased display name.
                 */
                readonly singular: string;

                /**
                 * The plural, formal-cased display name.
                 */
                readonly plural: string;

                /**
                 * The singular, lower-cased display name.
                 */
                readonly lowerSingular: string;

                /**
                 * The plural, lower-cased display name.
                 */
                readonly lowerPlural: string;

                /**
                 * The service display name.
                 */
                readonly service?: string;
            };

            /**
             * The options for the asset type.
             */
            readonly options?: AssetTypeOptions;

            /**
             * The browse type for the asset type.
             */
            readonly browseType: BrowseType;

            /**
             * The contracts flag for which contracts the asset view model supports.
             */
            readonly contracts: number;

            /**
             * Optional flag to indicate the asset type is from a preview extension.
             * If this flag is not specified, the asset type is NOT from a preview.
             */
            readonly isPreview?: boolean;

            /**
             * Optional flag to indicate the asset type is disabled by policy.
             * If this flag is not specified, the asset type is NOT disabled.
             */
            readonly isDisabled?: boolean;

            /**
             * The list of keywords.
             */
            readonly keywords?: ReadonlyArray<string>;

            /**
             * The description of asset type.
             */
            readonly description?: string;

            /**
             * The documentation links for asset type.
             */
            readonly links?: ReadonlyArray<{
                /**
                 * The link title for the asset type.
                 */
                readonly title: string;

                /**
                 * The link uri for the asset type.
                 */
                readonly uri: string;
            }>;

            /**
             * The list of hidden commands for the asset type.
             */
            readonly hiddenCommands?: ReadonlyArray<string>;

            /**
             * The resource type.
             */
            readonly resourceType: string;

            /**
             * The API resource type for ARM.
             * Only valid if resourceType is not undefined.
             * This is only valid for tenant-routing resources.
             */
            readonly topLevelTenantAlias?: string;

            /**
             * The API resource type for ARM.
             * Only valid if resourceType is not undefined.
             * This is only valid for end-point-routing resources.
             */
            readonly topLevelResourceTypeAlias?: string;

            /**
             * The ARM API version to use for this resource type.
             * Only valid if resourceType is not undefined.
             */
            readonly apiVersion?: string;

            /**
             * The routing type for the resource type.
             * Only valid if resourceType is not undefined.
             * If this is not specified, the 'Default' routing type will be used.
             */
            readonly routingType?: ResourceRoutingType;

            /**
             * The blade associated with the resource type.
             */
            readonly bladeName?: string;

            /**
             * The blade extension associated with the resource type.
             */
            readonly bladeExtensionName?: string;

            /**
             * The part associated with the resource type.
             */
            readonly partName?: string;

            /**
             * The part extension that contains the resource part.
             */
            readonly partExtensionName?: string;

            /**
             * The optional array of kinds for this resource type.
             */
            readonly kinds?: ReadonlyArray<ResourceTypeKind>;

            /**
             * The option for ARG browse.
             */
            readonly argBrowseOption?: ArgBrowseOptions;

            /**
             * The option for ARM browse.
             */
            readonly armBrowseOption?: ArmBrowseOptions;

            /**
             * The optional deep link for browse.
             */
            readonly browseDeepLink?: string;

            /**
             * The flag to show / hide columns for ARG browse.
             */
            readonly showArgColumns?: ReadonlyStringMap<boolean>;

            /**
             * Lower case copy of the resource type for quick lookup.
             */
            readonly lowerCaseResourceType: string;

            /**
             * Lower case copy of the asset type for quick lookup.
             */
            readonly lowerCaseAssetType: string;

            /**
             * Lower case copy of the extension name for quick lookup.
             */
            readonly lowerCaseExtension: string;

            /**
             * Map of kind name to resource type kind for quick lookup.
             * In the form of kindName => ResourceTypeKind
             */
            readonly kindMap?: ReadonlyStringMap<ResourceTypeKind>;

            /**
             * Optional name of the default kind for quick lookup.
             */
            readonly defaultKind?: string;
        }

        /**
         * Options passed to 'getAllAssetTypes'.
         */
        export interface GetAllAssetTypesOptions {
            /**
             * Include the browse manifest metadata.
             */
            includeBrowseManifest?: boolean;
        }

        /**
         * The asset type metadata with optional browse manifest data.
         */
        export type AssetTypeWithBrowseManifest = AssetType & { browseManifest?: Common.Assets.BrowseManifest };

    }

    export namespace Notifications {
        /**
         * Names an instance of some AssetType.
         */
        export type AssetDescriptor = {
            /**
             * The extension name where the AssetType is defined.
             */
            readonly extensionName: string;

            /**
             * The AssetType.
             */
            readonly assetType: string;

            /**
             * The asset ID.
             */
            readonly assetId: string;
        };

        /**
         * Describes an HTML view, defined in terms of an HTML template string later converted to HTML.
         */
        export type HtmlContent = {
            /**
             * The HTML template to display for the notification's description area.
             */
            readonly htmlTemplate: string;
        };

        /**
         * Defines the arguments for opening a blade from an actionable notification.
         */
        export type OpenBladeArgs = {
            /**
             * The blade name.
             */
            readonly blade: string;

            /**
             * The extension name.
             */
            readonly extension: string;

            /**
             * The inputs to the blade. Defaults to an empty object.
             */
            readonly parameters?: Record<string, any>;

            /**
             * Defines whether the blade should be launched in a context pane. Defaults to false.
             */
            readonly openInContextPane?: boolean;
        };

        /**
         * Defines the arguments for pinning a dashboard part from an actionable notification.
         */
        export type PinToDashboardArgs = {
            /**
             * Specifies the type of part to be pinned.
             */
            readonly partName: string;

            /**
             * The name of the extension for the pinned part.
             */
            readonly extension: string;

            /**
             * The parameters for the pinned part.
             */
            readonly parameters: Record<string, any>;
        };

        /**
         * Notification options needed to open a blade reference.
         */
        export type LinkToBladeReference = SimpleBladeReference & Pick<OpenBladeArgs, "openInContextPane">;

        /**
         * Notification contract returned when a notification is published, and has no following actions to be called.
         */
        export type Notification = {
            /**
             * The notification's unique id.
             * Can be used to follow the notification's lifecycle in telemetry.
             */
            readonly id: string;
        };

        /**
         * Defines an actionable notification's action.
         */
        export type Action = string | PinToDashboardArgs | LinkToBladeReference;

        /**
         * Defines an actionable notification button. Will appear below the description area of the notification.
         */
        export type Button = {
            /**
             * Optional button id which will be logged in telemetry (non-localized string).
             */
            id?: string;

            /**
             * Button label (should be localized).
             */
            readonly label: string;

            /**
             * Determines what clicking the button will do.
             *
             * Can be a string, a valid BladeReference, or the params for a pin to dashboard action.
             * If a fully qualified uri as a string, it will open a new tab. If a deeplink, it will navigate within same tab.
             *
             * @example
             * (As deepLink)
             *  action: '#/blade/myextensionname/mybladename'
             * @example
             * (As externalLink)
             *  action: 'https://www.bing.com/'
             * @example
             * (As BladeReference)
             *  action: {
             *      blade: 'MyBladeName',
             *      extension: 'MyExtensionName',
             *      parameters: { ...MyBladeParameters },
             *      openContextPane: true|false
             *  }
             * @example
             * (As PinToDashboard)
             *  action: {
             *      partName: 'MyPartName',
             *      extension: 'MyExtensionName',
             *      parameters: { ...MyPartParameters }
             *  }
             */
            readonly action: Action;

            /**
             * Styles the button as a secondary button. Defaults to false.
             */
            readonly isSecondary?: boolean;
        };

        /**
         * Defines the base options required to create a notification.
         */
        export type CommonNotificationOptions = {
            /**
             * List of Click To Actions (CTAs) available on this notification.
             * Currently the only supported CTAs are buttons, for a maximum of 3 buttons in total.
             */
            readonly actions?: ReadonlyArray<Button>;

            /**
             * Will be deprecated soon. Currently ignored.
             * The event correlation ids associated with the notification.
             */
            readonly correlationIds?: ReadonlyArray<string>;

            /**
             * The notification's description.
             */
            readonly description: string | HtmlContent;

            /**
             * Optionally, render the notification description as HTML.
             */
            readonly descriptionAsHtml?: boolean;

            /**
             * The notification's title.
             */
            readonly title: string;

            /**
             * A string URI that the notification links to or the BladeReference used to open a blade with.
             *
             * @example
             * (As deepLink)
             *  action: '#/blade/myextensionname/mybladename'
             * @example
             * (As externalLink)
             *  action: 'https://www.bing.com/'
             * @example
             * (As BladeReference)
             *  action: {
             *      blade: 'MyBladeName',
             *      extension: 'MyExtensionName',
             *      parameters: { ...MyBladeParameters },
             *      openContextPane: true|false
             *  }
             */
            readonly linkTo?: string | LinkToBladeReference | AssetDescriptor;
        };

        /**
         * Defines the options required to create and publish a one time notification.
         */
        export type NotificationOptions = CommonNotificationOptions & {
            /**
             * The notification status - Information, Warning, Error, Success.
             */
            readonly status: Exclude<Status, Status.InProgress>;
        };

        /**
         * Notification options for a pending notification.
         */
        export type PendingNotificationOptions = CommonNotificationOptions & {
            /**
             * The percentage of operation completed. If this value exists, a deterministic progress bar is shown.
             * If not, a non-deterministic progress icon is shown with a description.
             */
            readonly percentComplete?: number;
        };

        /**
         * Defines the base options required to create a polling notification.
         */
        export type CommonPollingNotificationOptions = {
            /**
             * List of Click To Actions (CTAs) available on this notification.
             * Currently the only supported CTAs are buttons, for a maximum of 3 buttons in total.
             */
            readonly actions?: ReadonlyArray<Button>;

            /**
             * The notification's description.
             */
            readonly description: string | HtmlContent;

            /**
             * The notification's title.
             */
            readonly title: string;

            /**
             * A string URI that the notification links to or the BladeReference used to open a blade with.
             *
             * @example
             * (As deepLink)
             *  action: '#/blade/myextensionname/mybladename'
             * @example
             * (As externalLink)
             *  action: 'https://www.bing.com/'
             * @example
             * (As BladeReference)
             *  action: {
             *      blade: 'MyBladeName',
             *      extension: 'MyExtensionName',
             *      parameters: { ...MyBladeParameters },
             *      openContextPane: true|false
             *  }
             */
            readonly linkTo?: string | LinkToBladeReference | AssetDescriptor;
        };

        /**
         * Defines the options required to create and publish a polling notification.
         */
        export type PollingNotificationOptions = CommonPollingNotificationOptions & {
            /**
             * Defines the options necessary for the Portal to poll on behalf of the notification creator,
             * and how to update the initial notification once the poll attempts return.
             */
            readonly pollingDetails: PollingDetails;
        };

        /**
         * Defines the options required to use the executeAzureAsyncOperation api.
         */
        export type ExecuteAzureAsyncPollingNotificationOptions = CommonPollingNotificationOptions & {
            /**
             * Defines the options necessary for the Portal to poll on behalf of the notification creator,
             * and how to update the initial notification once the poll attempts return.
             */
            readonly pollingDetails: ExecuteAzureAsyncPollingDetails;
        };

        /**
         * Defines the options required to create and publish a polling notification via the executeAzureAsyncOperation api.
         */
        export type AzureAsyncPollingNotificationOptions = CommonPollingNotificationOptions & {
            /**
             * Defines the options necessary for the Portal to poll on behalf of the notification creator,
             * and how to update the initial notification once the poll attempts return.
             */
            readonly pollingDetails: AzureAsyncPollingDetails;
        };

        /**
         * Options to update pending notification
         */
        export type PendingUpdateOptions = Omit<PendingNotificationOptions, "title" | "description"> & Partial<Pick<PendingNotificationOptions, "title" | "description">>;

        /**
         * Options to complete pending notification
         */
        export type PendingCompleteOptions = Omit<PendingUpdateOptions, "percentComplete"> & {
            /**
             * Status accompanying a finished pending notification.
             */
            readonly status: Exclude<Status, Status.InProgress>;
        };

        /**
         * Methods of interacting with a pending notification
         */
        export type PendingNotification = {
            /**
             * The notification's unique id.
             * Can be used to follow the notification's lifecycle in telemetry.
             */
            readonly id: string;

            /**
             * Method to update pending notification
             *
             * @param updateOptions: Options to update pending notification
             */
            update: (updateOptions: PendingUpdateOptions) => void;

            /**
             * Method to complete pending notification with failure or success
             *
             * @param completeOptions: Options to complete pending notification
             */
            complete: (completeOptions: PendingCompleteOptions) => void;
        };

        /**
         * The acceptable properties that an polling inprogress can have updated in default failure cases (ie. defaultFailureNotification).
         */
        export type PollingFailedOptions = Omit<CommonPollingNotificationOptions, "title" | "description"> & Partial<Pick<CommonPollingNotificationOptions, "title" | "description">>;

        /**
         * Defines the options required to create and publish a one time notification.
         */
        export type PollingCompleteOptions = PollingFailedOptions & {
            /**
             * The notification status - Information, Warning, Error, Success.
             */
            readonly status: Exclude<Status, Status.InProgress>;
        };

        /**
         * Properties common to all types of operations involving polling details.
         */
        export type CommonPollingDetails = {
            /**
             * The notification "update" options to update the original polling notification for when the failure circumstances aren't known.
             */
            readonly defaultFailureNotification: PollingFailedOptions;

            /**
             * The minimum amount of time in milliseconds to wait between each polling.
             * NOTE: default time between polling attempts starts out small and increases with time.
             * A custom delay will not shorten the space between polls, but will delay it when customDelayInMs is longer than the default.
             */
            readonly customDelayInMs?: number;

            /**
             * Amount of time in milliseconds to continue polling before falling back to a provided timeout notification.
             */
            readonly pollingTimeout?: TimeoutDetails;
        };

        /**
         * The record of notification instructions for updating an initial polling notification based on the polled response.
         * NOTE: Any non-empty string value is permitted as a record key, but "Succeeded", "Failed", and "Canceled" are required as per ARM docs.
         */
        export type ResponseNotificationByStatus = {
            Succeeded: PollingResponseDetails | string;
            Failed: PollingResponseDetails | string;
            Canceled: PollingResponseDetails | string;
            [key: string]: PollingResponseDetails | string;
        };

        /**
         * This property provides the polling notification api instructions unique to calling the executeAzureAsyncOperation api.
         * NOTE: If the responseNotificationByStatus and keepPollingStatuses don't have the status received,
         * polling will stop, and the defaultFailureNotification will be used to update the original notification.
         */
        export type ExecuteAzureAsyncPollingDetails = CommonPollingDetails & {
            /**
             * List of AzureAsyncOperation statuses that are the anticipated responses signaling api to keep polling.
             */
            readonly keepPollingStatuses: ReadonlyArray<string>;

            /**
             * Details for updates to the original polling notification based on each of a number of possible
             * response content statuses received from the batch promise. Whether a success or failure,
             * the notification details are associated with a specific response content status.
             * NOTE: "Succeeded", "Failed", and "Canceled" are the minimum required keys according to ARM docs for terminal provisioningStates/statuses.
             *
             * @example
             * When a response content status of "Failed" is received, the details within "notification"
             * will be used to update the original notification.
             *  {
             *      "Failed": {
             *          notification: {...}
             *      }
             *  }
             * @example
             * When a response content status of "Canceled" is received, it will redirect to the "Failed" status and
             * the details within that "notification" will be used to update the original notification.
             *  {
             *      "Failed": {
             *          notification: {...}
             *      },
             *      "Canceled": "Failed"
             *  }
             */
            readonly responseNotificationByStatus: ResponseNotificationByStatus;
        };

        /**
         * This property provides the instructions on what to poll and
         * what notification properties to use in updating original polling notification for a given response to the polled url
         * received during the execution of an executeAzureAsyncOperation api call.
         * NOTE: If the responseNotificationByStatus and keepPollingStatuses don't have the status received,
         * polling will stop, and the defaultFailureNotification will be used to update the original notification.
         */
        export type AzureAsyncPollingDetails = ExecuteAzureAsyncPollingDetails & {
            /**
             * The ARM/ARG uri the notification is expected to poll against.
             */
            readonly uri: string;
        };

        /**
         * This property provides the instructions on what to poll and
         * what notification properties to use in updating original polling notification for a given response to the polled url.
         * NOTE: If the responseNotificationByStatusCode and keepPollingCodes don't have the status code received,
         * polling will stop, and the defaultFailureNotification will be used to update the original notification.
         */
        export type PollingDetails = CommonPollingDetails & {
            /**
             * List of HTTP status codes that are the anticipated responses signaling api to keep polling.
             */
            readonly keepPollingCodes: ReadonlyArray<number>;

            /**
             * Details for updates to the original polling notification based on each of a number of possible
             * HTTP response codes received from the polled ARM/ARG uri. Whether a success or failure,
             * the notification details are associated with a specific HTTP Status Code.
             *
             * @example
             * When a response code of 200 is received, the details within "notification"
             * will be used to update the original notification.
             *  {
             *      "200": {
             *          notification: {...}
             *      }
             *  }
             * @example
             * When a response code of 202 is received, it will redirect to the "200" code and
             * the details within that "notification" will be used to update the original notification.
             *  {
             *      "200": {
             *          notification: {...}
             *      },
             *      "202": "200"
             *  }
             * @example
             * When any response code inclusively between 200 and 299 is received,
             * the details within that "notification" will be used to update the original notification.
             *  {
             *      "200-299": {
             *          notification: {...}
             *      }
             *  }
             * @example
             * When a response code of 300 is received, it will redirect to the ranged key "200-299" and
             * the details within that "notification" will be used to update the original notification.
             *  {
             *      "200-299": {
             *          notification: {...}
             *      },
             *      "300": "200-299"
             *  }
             */
            readonly responseNotificationByStatusCode: Record<string, PollingResponseDetails | string>;

            /**
             * The ARM/ARG uri the notification is expected to poll against.
             */
            readonly uri: string;
        };

        /**
         * Basic instructions for a given polling response scenario.
         * HTTP Status code matches the scenario to the given response,
         * and the notification provides the what-to-do when the scenario arises.
         * Will update the original polling notification with details contained in "notification" property.
         */
        export type PollingResponseDetails = {
            /**
             * The notification "update" options to update the original polling notification.
             */
            readonly notification: PollingCompleteOptions;

            /**
             * Requires that a specific value be present in the polled response content.
             * If the value is not present, or is different than expected,
             * the provided failureNotification will be used to update the original polling notification.
             * If not provided, polling will continue.
             */
            readonly requiredResponseValue?: RequiredResponseValue;
        };

        /**
         * Requires that a specific value be present in the polled response content.
         * If the value is not present, or is different than expected,
         * the provided failureNotification will be used. If not provided, polling will continue.
         */
        export type RequiredResponseValue = {
            /**
             * The notification options to update the original polling notification,
             * If left undefined, polling will continue.
             */
            readonly failureNotification?: PollingFailedOptions;

            /**
             * List of JSON-friendly keys pointing to the location within polled response content where
             * the required property value can be found.
             *
             * @example
             *  exampleResponse1.content: {
             *      "name": "testName",
             *      "properties": {
             *          "desiredProp": "desiredValue"
             *      }
             *  };
             *
             *  exampleResponse2.content: {
             *      "name": "testName",
             *      "properties": {
             *          "desiredProp": "keep polling value"
             *      }
             *  };
             *
             *  requiredResponseValue = {
             *      location: [ "properties", "desiredProp" ],
             *      value: "desiredValue",
             *      pollingValues: ["keep polling value", "alternate polling value"],
             *  };
             *
             *  example content #1: Will find "desiredValue" from response.content using location keys and first compare it against "pollingValues".
             *  When it doesn't match, it will compare it against the "value". Since both contain "desiredValue", it passes and uses the "notification" to update.
             *
             *  example content #2: Will find "keep polling value" from response.content using location keys and first compare it against elements in "pollingValues".
             *  When it does match, the api will continue to poll.
             *
             *  If the location keys fail to find a matching "value" or "pollingValues", the contents of "failureNotification"
             *  are used to update the original polling notification and polling stops.
             *  If "failureNotification" is not provided, polling will continue until a match is found or the timeout condition is reached.
             */
            readonly location: ReadonlyArray<string>;

            /**
             * The required value to compare against the value to be found within the polling response content.
             * Can be set to anything other than undefined.
             */
            readonly value: any;

            /**
             * The values to compare against the value found within the polling response content, and if match is found, signals the api to keep polling.
             */
            readonly pollingValues?: (string | number | boolean)[];
        };

        /**
         * Optional amount of time to allow polling before timing out,
         * and the notification details to use in updating the original polling notification.
         */
        export type TimeoutDetails = {
            /**
             * The notification "update" options to update the original polling notification when polling times out.
             */
            readonly failureNotification: PollingFailedOptions;

            /**
             * Amount of time in milliseconds to continue polling before falling back to the failureNotification.
             * The default is 24 hours, and only a pollingTimeout of less than 24 hours will be honored.
             */
            readonly timeoutInMs: number;
        };

        /**
         * Status accompanying a notification.
         */
        export const enum Status {
            /**
             * An Information notification with icon containing lowercase white i on a blue circular background.
             */
            Information = 0,

            /**
             * A Warning notification with icon containing white ! on a yellow triangular background.
             */
            Warning = 1,

            /**
             * An Error notification with icon containing white ! on a red circular background.
             */
            Error = 2,

            /**
             * An in progress notification with animated ellipsis icon.
             */
            InProgress = 3,

            /**
             * A Success notification with icon containing white checkmark on a green circular background.
             */
            Success = 4,
        }

        /**
         * Status accompanying a notification with no remaining updates.
         */
        export const enum CompletedStatus {
            /**
             * An Information notification with icon containing lowercase white i on a blue circular background.
             */
            Information = 0,

            /**
             * A Warning notification with icon containing white ! on a yellow triangular background.
             */
            Warning = 1,

            /**
             * An Error notification with icon containing white ! on a red circular background.
             */
            Error = 2,

            /**
             * A Success notification with icon containing white checkmark on a green circular background.
             */
            Success = 4,
        }


        //notifications#ToastDuration
        /**
         * Notification toast duration.
         */
        export const enum ToastDuration {
            /**
             * Toast stays for 5 seconds.
             */
            Short = 0,

            /**
             * Toast stays for 30 seconds.
             */
            Long = 1,

            /**
             * Toast stays till the user manually dismisses it.
             */
            Sticky = 2,

            /**
             * Suppress toast notification.
             */
            Suppress = 3,

            /**
             * Modal toast notification. By default this option won't be allowed unless white listed.
             * If you need to onboard a modal notification, please contact the Portal team.
             */
            Modal = 4,
        }
        //notifications#ToastDuration

        export namespace IrisNotifications {
            /**
             * Placement information for requesting Iris content.
             */
            export interface Placement {
                /**
                 * The placement id.
                 */
                readonly placementId: string;

                /**
                 * The max number of message to receive for the placement.
                 */
                readonly messageLimit: number;
            }

            /**
             * Represents a single Iris error.
             */
            export interface Error {
                /**
                 * The error code from Iris (not HTTP status code). Not used.
                 */
                readonly code: number;

                /**
                 * Human-readable error message.
                 */
                readonly msg: string;
            }

            /**
             * Iris type singular message item.
             */
            export interface Message<T = any> {
                /**
                 * Body of the message that represents the data contract for a particular campaign template. This is a customizable dynamic data structure pre-defined between Iris and requesters.
                 */
                readonly ad: T;

                /**
                 * Wrapper containing the uri for broadcasting impression beacons. Impression beacons should be sent when the message is activated/shown to the target user so the message frequency can be capped.
                 */
                readonly prm: { readonly _imp: string };

                /**
                 * Wrapper containing the uri for broadcasting actions beacon (can be any telemetry action such as message received signals or user interactions).
                 */
                readonly tracking: { readonly baseUri: string };
            }

            /**
             * Represents the processed Iris response for downstream consumption.
             * Maps placement id to the items and/or errors. Arrays could be empty.
             */
            export type IrisContent = ReadonlyStringMap<{
                /**
                 * The Iris messages for the placement.
                 */
                readonly items?: ReadonlyArray<Message>;

                /**
                 * The Iris errors for the placement.
                 */
                readonly errors?: ReadonlyArray<Error>;
            }>;

            /**
             * Arguments for calling the getIrisContent API.
             */
            export interface GetIrisContentOptions {
                /**
                 * List of placements to fetch content.
                 */
                readonly placements: Placement[];
            }

            /**
             * Signal information to send to Iris.
             */
            export interface SignalOptions {
                /**
                 * The iris message that the signal will be sent to.
                 */
                readonly message: Message;

                /**
                 * If specified, action signals will be sent. Otherwise impression signals will be sent.
                 */
                readonly action?: ActionOptions;
            }

            /**
             * Action information to send to Iris.
             */
            export interface ActionOptions {
                /**
                 * The action name, such as click, like, hover.
                 * A list of standard Iris action can be found here: https://www.osgwiki.com/wiki/Iris_Insights_Beacons#Standard_Iris_actions.
                 */
                readonly name: string;

                /**
                 * The additional action metadata to send through URL parameters.
                 */
                readonly parameters?: ReadonlyStringMap<string>;
            }
        }
    }

    export namespace Units {
        export const higherByteOffset = 8;
        export const perTimeBit = 128; // 1 << (higherByteOffset - 1);

        // Internal UnitType for Unit
        export const enum UnitType {
            None = 0,
            Bytes,
            Decimal,
            Time,
            BytesPerTime,
            DecimalPerTime,
            Bytes_SI,
            BytesPerTime_SI,
        }

        /**
         * Defines units.
         */
        export const enum Unit {
            None = 0, // UnitType.None << higherByteOffset
            Percentage = 1, // None + 1,
            Bytes = 256, // UnitType.Bytes << higherByteOffset,
            Kilobytes = 257, // Bytes + 1,
            Megabytes = 258, // Bytes + 2,
            Gigabytes = 259, // Bytes + 3,
            Terabytes = 260, // Bytes + 4,
            Petabytes = 261, // Bytes + 5,
            BytesPerDay = 1152, // (UnitType.BytesPerTime << higherByteOffset) | perTimeBit
            BytesPerHour = 1153, // BytesPerDay + 1,
            BytesPerMinute = 1154, // BytesPerDay + 2,
            BytesPerSecond = 1155, // BytesPerDay + 3,
            KilobytesPerSecond = 1156, // BytesPerDay + 4,
            MegabytesPerSecond = 1157, // BytesPerDay + 5,
            GigabytesPerSecond = 1158, // BytesPerDay + 6,
            TerabytesPerSecond = 1159, // BytesPerDay + 7,
            PetabytesPerSecond = 1160, // BytesPerDay + 8,
            Count = 512, // UnitType.Decimal << higherByteOffset
            Thousand = 513, // Count + 1,
            Million = 514, // Count + 2,
            Billion = 515, // Count + 3,
            Trillion = 516, // Count + 4,
            MicroSeconds = 768, //UnitType.Time << higherByteOffset
            MilliSeconds = 769, // MicroSeconds + 1,
            Seconds = 770, // MicroSeconds + 2,
            Minutes = 771, // MicroSeconds + 3,
            Hours = 772, // MicroSeconds + 4,
            Days = 773, // MicroSeconds + 5,
            CountPerDay = 1408, // (UnitType.DecimalPerTime << higherByteOffset) | perTimeBit
            CountPerHour = 1409, // CountPerDay + 1,
            CountPerMinute = 1410, // CountPerDay + 2,
            CountPerSecond = 1411, // CountPerDay + 3,
            ThousandPerSecond = 1412, // CountPerDay + 4,
            MillionPerSecond = 1413, // CountPerDay + 5,
            BillionPerSecond = 1414, // CountPerDay + 6,
            TrillionPerSecond = 1415, // CountPerDay + 7,
            Bytes_SI = 1536, // UnitType.Bytes_SI << higherByteOffset
            Kilobytes_SI = 1537, // Bytes_SI + 1,
            Megabytes_SI = 1538, // Bytes_SI + 2,
            Gigabytes_SI = 1539, // Bytes_SI + 3,
            Terabytes_SI = 1540, // Bytes_SI + 4,
            Petabytes_SI = 1541, // Bytes_SI + 5,
            BytesPerDay_SI = 1920, // (UnitType.BytesPerTime_SI << higherByteOffset) | perTimeBit
            BytesPerHour_SI = 1921, // BytesPerDay_SI + 1,
            BytesPerMinute_SI = 1922, // BytesPerDay_SI + 2,
            BytesPerSecond_SI = 1923, // BytesPerDay_SI + 3,
            KilobytesPerSecond_SI = 1924, // BytesPerDay_SI + 4,
            MegabytesPerSecond_SI = 1925, // BytesPerDay_SI + 5,
            GigabytesPerSecond_SI = 1926, // BytesPerDay_SI + 6,
            TerabytesPerSecond_SI = 1927, // BytesPerDay_SI + 7,
            PetabytesPerSecond_SI = 1928, // BytesPerDay_SI + 8,
        }
    }

    export namespace Assets {
        /**
         * Defines the locations in portal where a given command can be shown.
         */
        export const enum CommandVisibility {
            /**
             * Allows a command to appear on browse toolbar.
             */
            BrowseToolbar = 1,

            /**
             * Allows a command to appear in browse context menu.
             *
             * NOTE: Only selection based commands with minSelection === 1 support this option.
             *       Menu commands do not support this option.
             */
            BrowseContextMenu = 2, // BrowseToolbar << 1,

            /**
             * Allows a command to appear on empty browse view.
             */
            BrowseEmptyView = 4, // BrowseContextMenu << 1,

            /**
             * Allows a command to appear on resource hover card.
             */
            ResourceHoverCard = 8, // BrowseEmptyView << 1,

            /**
             * Allows a command to be hidden by default.
             *
             * NOTE: This is useful if you are experimenting with command bar layout and wish to only show a command via experimentation.
             */
            HiddenByDefault = 16, // ResourceHoverCard << 1,

            /**
             * Allows a command to replace default "create" button on a service hover card.
             *
             * NOTE: Only one command with this flag is supported per asset type.
             */
            ServiceHoverCard = 32, // HiddenByDefault << 1,
        }

        /**
         * The blade reference options for open blade command.
         */
        export type BladeReferenceOptions = {
            /**
             * The blade name.
             */
            readonly blade: string;

            /**
             * The flag indicating whether blade supports provisioning.
             * Defaults to false.
             */
            readonly doesProvisioning?: boolean;

            /**
             * The extension name for the blade
             */
            readonly extension?: string;

            /**
             * The flag indicating whether blade needs to be opened as a context pane.
             * Defaults to false.
             */
            readonly inContextPane?: boolean;

            /**
             * The blade parameters.
             */
            readonly parameters?: StringMap<any>;
        }

        /**
         * Interface for resource selection in browse commands.
         */
        export type BrowseResourceSelection = {
            /**
             * The max number of selected resources supported by the command operation.
             */
            readonly maxSelectedItems?: number;

            /**
             * The min number of selected resources supported by the command operation.
             */
            readonly minSelectedItems?: number;

            /**
             * The message shown when user tries to select more than supported items by the command operation.
             */
            readonly disabledMessage?: string;
        }

        /**
         * The interface for command execution confirmation options.
         */
        export type ConfirmationOptionsManifest = {
            /**
             * The confirmation title.
             */
            readonly title?: string;

            /**
             * The confirmation message.
             */
            readonly message: string;

            /**
             * The confirmation text input.
             * User needs to enter this text in order to confirm command execution.
             */
            readonly explicitConfirmationText?: string;
        }

        /**
         * Various opt-in configs to describe how long running ARM operations needs to be polled and results processed for Bulk commanding.
         */
        export type AsyncOperationOptions = {
            /**
             * By default when http Accepted (202) status code is received, the Location header will be looked up for polling uri to get the status of long running operation.
             * A different response header can be specified with the pollingHeaderOverride value.
             */
            readonly pollingHeaderOverride?: string;

            /**
             * A property path to look for status in the response body.
             * By default 'status' property will be looked up to see if it has "Succeeded", "Failed", "InProgress" or "Canceled".
             */
            readonly statusPath?: string;
        }

        /**
         * Command definition for ARM operation.
         */
        export type ArmCommandDefinition = {
            /**
             * Http method POST/DELETE/PATCH etc. By default POST will be used.
             */
            readonly httpMethodType?: string;

            /**
             * ARM uri for the command operation. Currently only ARM operations are supported.
             * Uri should be a relative uri with the fixed format - {resourceid}/placeholder.
             * Eg. "{resourceid}/start?api-version=2016-03-30"
             */
            readonly uri: string;

            /**
             * ARM command operation can be long running operation. asyncOperation property specifies how to poll the status for completion of long running operation.
             */
            readonly asyncOperation?: AsyncOperationOptions;

            /**
             * The list of resource-specific ARM error codes that should be retried.
             */
            readonly retryableArmCodes?: ReadonlyArray<string>;

            /**
             * The list of resource-specific ARM error codes that shouldn't be retried.
             * This helps optimize network calls and improve bulk operation performance.
             */
            readonly nonRetryableArmCodes?: ReadonlyArray<string>;
        }

        /**
         * Interface for ARM command options.
         */
        export type ArmCommandOptionsManifest = {
            /**
             * The ARM bulk command definitions.
             */
            readonly definitions?: StringMap<ArmCommandDefinition>;

            /**
             * The flag indicating whether to launch Fx bulk delete confirmation blade for bulk delete operations.
             *
             * NOTE: All ARM bulk delete commands should set this flag to true for consistent bulk delete confirmation experience.
             */
            readonly isDelete?: boolean;
        }

        /**
         * Interface for asset type command manifest.
         */
        export type CommandManifest = {
            /**
             * Specify a unique identifier or friendly command name (non localized string). This will be used for telemetry.
             */
            readonly id: string;

            /**
             * Command label shown in the toolbar.
             */
            readonly label: string;

            /**
             * Command icon shown in the toolbar.
             */
            readonly icon: Images.Image;

            /**
             * Command aria label.
             */
            readonly ariaLabel?: string;

            /**
             * Command tooltip shown on hover.
             */
            readonly toolTip?: string;

            /**
             * Content used for displaying subtitle for the menu command items only.
             */
            readonly content?: string;

            /**
             * The command visibility options.
             * Specify one or more options in the format: `CommandVisibility.BrowseToolbar | CommandVisibility.BrowseEmptyView`.
             */
            readonly visibility?: CommandVisibility;

            /**
             * The blade reference.
             */
            readonly bladeReference?: BladeReferenceOptions;

            /**
             * The marketplaceItemId to open create flows.
             */
            readonly marketplaceItemId?: string;

            /**
             * The browse grid selection model.
             */
            readonly selection?: BrowseResourceSelection;

            /**
             * The command execution confirmation options.
             */
            readonly confirmation?: ConfirmationOptionsManifest;

            /**
             * The ARM bulk command definition options.
             */
            readonly armCommandDefinitionOptions?: ArmCommandOptionsManifest;

            /**
             * The list of commands.
             */
            readonly commands?: ReadonlyArray<CommandManifest>;
        }

        /**
         * The interface for ARM bulk commands.
         */
        export type ArmStaticCommand = CommandManifest & {
            /**
             * The ARM bulk command definitions.
             */
            readonly armCommandDefinitions?: StringMap<ArmCommandDefinition>;

            /**
             * The flag indicating whether to launch Fx bulk delete confirmation blade for bulk delete operations.
             *
             * NOTE: All ARM bulk delete commands should set this flag to true for consistent bulk delete confirmation experience.
             */
            readonly isBulkDeleteOperation?: boolean;
        }

        /**
         * This represents an asset type display name in it's four forms.
         */
        export type CompositeDisplayName = {
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
        }

        /**
         * Represents a set of flags for the contracts supported by the asset view model.
         */
        export const enum AssetTypeContracts {
            /**
             * No contracts supported by the asset type.
             */
            None = 0,

            /**
             * OBSOLETE - do not remove, do not use.
             */
            ObsoleteAssetInfo = 1, // 1

            /**
             * The asset type supports the browse config contract.
             */
            BrowseConfig = 2, // ObsoleteAssetInfo << 1, // 1 << 1

            /**
             * The asset type supports the supplemental data contract.
             */
            SupplementalData = 4, // BrowseConfig << 1, // 1 << 2

            /**
             * The asset type supports the resource menu config contract.
             */
            ResourceMenuConfig = 8, // SupplementalData << 1, // 1 << 3

            /**
             * The asset type supports the resource menu config contract but only for kinds marked as use resource menu.
             */
            KindResourceMenuConfig = 16, // ResourceMenuConfig << 1, // 1 << 4

            /**
             * The asset type supports static resource menu overview.
             */
            StaticResourceMenuOverview = 32, // KindResourceMenuConfig << 1, // 1 << 5

            /**
             * The asset type supports providing resources contract.
             */
            ProvidesResources = 64, // StaticResourceMenuOverview << 1, // 1 << 6

            /**
             * The asset type's resource menu blade can load the resource provided by the extension.
             */
            ExtensionSuppliesResourceForResourceMenu = 128, // ProvidesResources << 1, // 1 << 7

            /**
             * The asset type's resource menu blade can ignore the resource.
             */
            NoResourceForResourceMenu = 256, // ExtensionSuppliesResourceForResourceMenu << 1, // 1 << 8

            /**
             * The asset type has the kind override flags.
             */
            HasKindOverrideFlags = 512, // NoResourceForResourceMenu << 1, // 1 << 9

            /**
             * The asset type has a kind which overrides the use resource menu flag.
             */
            HasKindWhichOverridesUseResourceMenu = 1024, // HasKindOverrideFlags << 1, // 1 << 10

            /**
             * The asset type has a kind which overrides the display name.
             */
            HasKindWhichOverridesDisplayName = 2048, // HasKindWhichOverridesUseResourceMenu << 1, // 1 << 11

            /**
             * The asset type has a kind which overrides the blade.
             */
            HasKindWhichOverridesBlade = 4096, // HasKindWhichOverridesDisplayName << 1, // 1 << 12

            /**
             * The asset type has a kind which overrides the icon.
             */
            HasKindWhichOverridesIcon = 8192, // HasKindWhichOverridesBlade << 1, // 1 << 13

            /**
             * The asset type supports browse using a query from PDL.
             */
            SupportsBrowseQuery = 16384, // HasKindWhichOverridesIcon << 1, // 1 << 14

            /**
             * The asset type supports a declarative menu.
             */
            SupportsAssetMenu = 32768, // SupportsBrowseQuery << 1, // 1 << 15
        }

        /**
         * The documentation link for the asset type.
         */
        export type Link = {
            /**
             * The link title for the asset type.
             */
            title: string;

            /**
             * The link uri for the asset type.
             */
            uri: string;
        }

        /**
         * The browse command experiments for the asset type.
         */
        export type AssetTypeBrowseCommandLayout = {
            /**
             * The array of non selection commands.
             */
            readonly commands?: ReadonlyArray<string>;

            /**
             * The array of selection commands.
             */
            readonly selectionCommands?: ReadonlyArray<string>;
        }

        export const enum ProxyRoutingFilter {
            /**
             * Text proxy routing filter.
             */
            TextFilter = 1,

            /**
             * Resource group proxy routing filter.
             */
            ResourceGroupFilter = 2,

            /**
             * Location proxy routing filter.
             */
            LocationFilter = 3,
        }

        /**
         * Pre-defined columns for resource types.
         */
        export const enum ResourceColumnIds {
            /**
             * The name resource column.
             */
            Name = 1,

            /**
             * The kind resource column.
             */
            Kind = 2,

            /**
             * The resource group resource column.
             */
            ResourceGroup = 3,

            /**
             * The location resource column.
             */
            Location = 4,

            /**
             * The location ID resource column.
             */
            LocationId = 5,

            /**
             * The resource ID resource column.
             */
            ResourceId = 6,

            /**
             * The resource group ID resource column.
             */
            ResourceGroupId = 7,

            /**
             * The resource type resource column.
             */
            ResourceType = 8,

            /**
             * The subscription resource column.
             */
            Subscription = 9,

            /**
             * The subscription ID resource column.
             */
            SubscriptionId = 10,

            /**
             * The asset type resource column.
             */
            AssetType = 11,

            /**
             * The tags resource column.
             */
            Tags = 12,

            /**
             * The edge zone resource column.
             */
            EdgeZone = 13,
        }

        export const enum ColumnFormat {
            /**
             * The column has no format (used only in typescript).
             */
            NoFormat = 0,

            /**
             * Simple string column direct from ARG results.
             */
            String = 1,

            /**
             * Resource column which is an ARM ID from ARG results.
             */
            Resource = 2,

            /**
             * Simple date column direct from ARG results.
             */
            Date = 3,

            /**
             * The result from ARG will be mapped as a number based on the user's current locale.
             */
            Number = 4,

            /**
             * The result from ARG will be mapped to a location display name.
             */
            Location = 5,

            /**
             * Simple string column direct from ARG results that will launch a blade using the Blade property of the column.
             */
            BladeLink = 6,

            /**
             * The result from ARG will be mapped to a tenant display name.
             */
            Tenant = 7,

            /**
             * The result from ARG will be the text for the column representing the resource status.
             */
            Status = 8,

            /**
             * Object column direct from ARG results that will launch a deep link.
             */
            DeepLink = 9,

            /**
             * Object column direct from ARG results that will launch a blade.
             */
            QueryBladeLink = 10,
        }

        export const enum SummaryVisualizations {
            /**
             * The summary has no visualizations.
             */
            NoVisualizations = 0,

            /**
             * The summary is available as a map visualization (must be location summary).
             */
            Map = 1,

            /**
             * The summary is available as a bar chart visualization.
             */
            BarChart = 2,

            /**
             * The summary is available as a donut chart visualization.
             */
            DonutChart = 4,

            /**
             * The summary is available as a grid (list) visualization.
             */
            Grid = 8,

            /**
             * The result from ARG will be mapped as a number based on the user's current locale.
             */
            Default = 2147483646,

            /**
             * The result from ARG will be mapped to a location display name.
             */
            DefaultWithMap = 2147483647,
        }

        export type BrowseColumnManifest = {
            /**
             * Name of the column.
             */
            name: string;

            /**
             * Optional name of the column used for sorting the column.
             */
            sortColumn?: string | ResourceColumnIds;

            /**
             * Localized display name of the column.
             */
            displayName: string;

            /**
             * Localized lowercase display name of the column.
             */
            lowerDisplayName?: string;

            /**
             * Optional description localized string of the column.
             */
            description?: string;

            /**
             * Columns format of the column.
             */
            format: ColumnFormat;

            /**
             * Optional width of the column (in grid units).
             */
            width?: string;

            /**
             * Optional source units the number column.
             */
            sourceUnits?: Units.Unit;

            /**
             * Optional maximum fraction digits the number column.
             */
            maximumFractionDigits?: number;

            /**
             * Optional blade name for BladeLink columns.
             */
            bladeName?: string;

            /**
             * Optional blade extension name for BladeLink columns.
             */
            bladeExtensionName?: string;

            /**
             * Optional name of the column for the blade parameters for BladeLink columns.
             */
            bladeParameterColumn?: string | ResourceColumnIds;

            /**
             * Optional flag to launch the blade in a context pane for BladeLink and QueryBladeLink columns.
             */
            openBladeAsContextPane?: boolean;

            /**
             * Optional name of the column for the icon for Status columns.
             */
            iconColumn?: string | ResourceColumnIds;

            /**
             * Optional flag to prevent using this column for the summary columns.
             */
            preventSummary?: boolean;

            /**
             * Optional query for the column used for the summary for this column. This is used for summary drill down when
             * the summary produces a new ARG column. This query should extend the new ARG column into the results and the
             * `summaryQuery` is used to summarize over that column.
             *
             * @example
             * - A resource type 'lenses' produces a new ARG column 'focalLength' which is based on a double value
             * 'focalValue' and the summary will be for the 'focalLength' string:
             *
             * The query for `columnQueryForSummary` must produce (extend) the column:
             *
             * ```
             * extend focalLength = case(
             *     (focalValue < 50), 'wide',
             *     (focalValue < 120), 'normal',
             *     'telephoto')
             * ```
             *
             * The query for `summaryQuery` can then use the produced column:
             *
             * ```
             * summarize focalLengthCount=count() by focalLength
             * ```
             *
             * The value of `summaryColumn` then points to the 'focalLength' column.
             */
            columnQueryForSummary?: string;

            /**
             * Optional query for the summarization for this column. If the `columnQueryForSummary` is provided, that is
             * prepended to this query for the summarization to produce any required ARG columns needed by the
             * `summaryQuery`.
             *
             * @see `columnQueryForSummary`
             */
            summaryQuery?: string;

            /**
             * Optional name of the summary column for the column that is produced by the `summaryQuery`.
             *
             * @see `columnQueryForSummary` and `summaryQuery`
             */
            summaryColumn?: string;

            /**
             * Optional summary visualizations for the column. If not set, standard bar and donut charts along with grid (list) are used.
             */
            summaryVisualizations?: SummaryVisualizations;
        }

        export type MergedResourceTypeManifest = {
            /**
             * Name of the resource type.
             */
            resourceTypeName: string;

            /**
             * Name of the resource type kind.
             */
            resourceKindName?: string;

            /**
             * Optional flag indicating whether the merged resource type is selected by default.
             */
            selected?: boolean;

            /**
             * Additional kinds if the resourceKindName is set. This is used for merged kinds where the resourceKindName is used
             * for the display name but the resourceKindName and the additionalKinds are combined for the query filtering.
             */
            additionalKinds?: string[];
        };

        /**
         * Asset type command definitions including Browse bulk commanding.
         */
        export type CommandSet = {
            /**
             * List of kinds that support given commands.
             */
            readonly kinds?: ReadonlyArray<string>;

            /**
             * Command definitions generic operations.
             */
            readonly commands?: ReadonlyArray<CommandManifest>;

            /**
             * Command definitions for resource selection based operations.
             */
            readonly selectionCommands?: ReadonlyArray<CommandManifest>;
        }

        export const enum BrowseInfoBoxStyle {
            /**
             * Info style.
             */
            Info = 1,

            /**
             * Upsell style.
             */
            Upsell = 2,

            /**
             * Success style.
             */
            Success = 3,

            /**
             * Warning style.
             */
            Warning = 4,

            /**
             * Error style.
             */
            Error = 5,
        }

        export type BrowseInfoBoxManifest = {
            /**
             * The display string for the info box.
             */
            display: string;

            /**
             * The style of the info box.
             */
            style: BrowseInfoBoxStyle;

            /**
             * Optional flag to hide the info box (can be overridden in config).
             */
            hidden?: boolean;

            /**
             * Optional URI for a link for the info box.
             */
            linkUri?: string;

            /**
             * Optional target for a link for the info box.
             */
            linkTarget?: string;

            /**
             * Optional blade name for a blade link for the info box.
             */
            bladeName?: string;

            /**
             * Optional extension name for a blade link for the info box.
             */
            bladeExtensionName?: string;

            /**
             * Optional flag to open blade in context pane for a blade link for the info box.
             */
            openBladeAsContextPane?: boolean;
        }

        export type BrowseManifest = {
            /**
             * Name of the asset type of the browse definition.
             */
            name: string;

            /**
             * Browse query for ARG browse.
             */
            browseQuery: string;

            /**
             * Array of default columns for the browse (either a column name or a built-in column).
             */
            defaultColumns: (string | ResourceColumnIds)[];

            /**
             * The array of column IDs for additional filter pills displayed by default.
             * Filter pills for columns specified here will be displayed with initial "all selected" value.
             */
            defaultFilters?: (string | ResourceColumnIds)[];

            /**
             * Array of columns to exclude from the browse.
             */
            excludeColumns?: (
                | ResourceColumnIds.SubscriptionId
                | ResourceColumnIds.ResourceGroup
                | ResourceColumnIds.Location
                | ResourceColumnIds.Tags
            )[];

            /**
             * Array of column definitions.
             */
            columns: BrowseColumnManifest[];

            /**
             * Optional column which contains the resource status to display in the resource part.
             */
            statusColumn?: string;

            /**
             * Array of merged resource type definitions.
             */
            mergedResourceTypes?: MergedResourceTypeManifest[];

            /**
             * Optional flag which indicates whether to honor the selected flag on the merged resource types.
             */
            honorSelectedMergedResourceTypes?: boolean;

            /**
             * Array of asset type command definitions.
             */
            commands?: CommandSet;

            /**
             * Map of kind level command definitions.
             */
            kindCommands?: ReadonlyStringMap<CommandSet>;

            /**
             * Map of kind name to the key in kindCommands map.
             *
             * This is generated in order to avoid duplicating commands for merged kinds
             */
            kindCommandNameMapping?: ReadonlyStringMap<string>;

            /**
             * Optional parent resource type for browse.
             *
             * The parent resource type if defined will determine the display name of the browse blade as well as the
             * resource type used for browse blade view management.
             */
            browseParentResourceType?: string;

            /**
             * Optional info box for browse.
             */
            infoBox?: BrowseInfoBoxManifest;

            /**
             * Optional flag to indicate that edge zones are supported by the query supplied in browseQuery.
             */
            edgeZonesSupported?: boolean;

            /**
             * Optional feature cards which are enabled for browse.
             */
            featureCards?: BrowseFeatureCardReference[];
        }

        /**
         * Represents a feature card reference for browse.
         */
        export type BrowseFeatureCardReference = {
            /**
             * The feature card ID.
             */
            readonly id: string;

            /**
             * The extension that owns the feature card.
             */
            readonly extension: string;

            /**
             * The enabled value (boolean or experiment name) for the feature card.
             */
            readonly enabled: boolean | string;
        }

        /**
         * Represents a feature card from an extension manifest.
         */
        export type FeatureCardManifest = {
            /**
             * ID of the feature card.
             */
            readonly id: string;

            /**
             * Label of the feature card.
             */
            readonly label: string;

            /**
             * Tooltip of the feature card.
             */
            readonly tooltip: string;

            /**
             * Icon of the feature card.
             */
            readonly icon: Images.Image;

            /**
             * Count query for the feature card.
             */
            readonly countQuery: string;

            /**
             * Name for the target blade of the feature card.
             */
            readonly bladeName: string;

            /**
             * Extension for the target blade of the feature card.
             */
            readonly bladeExtensionName: string;

            /**
             * Blade parameters for the target blade of the feature card.
             */
            readonly bladeParameters: any;

            /**
             * The resource type filter of the feature card.
             */
            readonly resourceTypes: ReadonlyStringMap<(boolean | string)>;
        }

        /**
         * The feature card extension and manifest pair.
         */
        export type FeatureCard = {
            /**
             * The extension that owns the feature card manifest.
             */
            readonly extension: string;

            /**
             * The manifest for the feature card.
             */
            readonly manifest: Assets.FeatureCardManifest;
        };

        /**
         * Represents a reference to a blade to launch upon initiating creation of a resource through the framework provisioner.
         */
        export type PostCreateBladeReference = {
            /**
             * The blade name.
             */
            readonly bladeName: string;

            /**
             * The extension name. If not provided, this defaults to the current extension name.
             */
            readonly extensionName: string;

            /**
             * Am optional flag indicating the blade should be used based on an experiment treatment.
             */
            readonly useFlighting?: boolean;
        }
    }

    export namespace Browse {
        /**
         * The browse location data which is a subset of the ARM location (MsPortalFx.Azure.Location).
         */
        export type BrowseLocation = {
            /**
             * The display name of the location.
             */
            displayName: string;

            /**
             * The latitude of the location.
             */
            latitude?: number | string;

            /**
             * The longitude of the location.
             */
            longitude?: number | string;
        }

        /**
         * The resource columns interface for persistence to user settings.
         */
        export type ResourceColumnSettings = {
            /**
             * The column ID.
             */
            readonly id: string;

            /**
             * The column visibility.
             */
            readonly visible: boolean;
        }

        /**
         * Data model for a tenant.
         */
        export type Tenant = {
            /**
             * Tenant id.
             */
            readonly id: string;

            /**
             * The tenant domain name.
             */
            readonly domainName: string;

            /**
             * The tenant display name.
             */
            readonly displayName: string;

            /**
             * The tenant category.
             */
            readonly tenantCategory: string;
        }

        /**
         * The browse prereq's for ARG browse.
         */
        export type BrowsePrereqs = {
            /**
             * The query manifest.
             */
            readonly browseQueryManifest: Assets.BrowseManifest;

            /**
             * The location map from ID to location data.
             */
            readonly locations: StringMap<BrowseLocation>;

            /**
             * The asset type map from resource type to resource type details.
             */
            readonly assetTypes: StringMap<ArgInterfacesCore.ResourceTypeDetails>;

            /**
             * Optional column settings if requested.
             */
            readonly columnSettings?: StringMap<ResourceColumnSettings[]>;

            /**
             * Optional favorite view ID.
             */
            readonly favoriteViewId?: string;

            /**
             * Optional directories map if specified columns contain a tenant column.
             */
            readonly directoriesMap?: StringMap<Tenant>;

            /**
             * Optional collection of feature card manifests.
             */
            readonly featureCards?: Assets.FeatureCard[];
        }
    }

    export namespace ArgInterfacesCore {
        /**
         * The blade details for the resource type or its kind.
         */
        export type ResourceTypeOrKindBladeDetails = {
            /**
             * The name of the blade.
             */
            readonly bladeName: string;

            /**
             * The extension to load the blade from.
             */
            readonly extensionName: string;
        }

        /**
         * The part details for the resource type or its kind.
         */
        export type ResourceTypeOrKindPartDetails = {
            /**
             * The name of the part.
             */
            readonly partName: string;

            /**
             * The extension for the part.
             */
            readonly extensionName: string;
        }

        /**
         * Details about the resource type or its kind.
         */
        export type ResourceTypeOrKindDetails = {
            /**
             * The description for the asset type/kind.
             */
            readonly description: string;

            /**
             * The display name.
             */
            readonly displayName: Readonly<Assets.CompositeDisplayName>;

            /**
             * The icon.
             */
            readonly icon: Images.Image;

            /**
             * The options for the asset type or the kind.
             */
            readonly options: AssetTypes.AssetTypeOptions;

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
        }

        /**
         * Details about the resource type kind.
         */
        export type ResourceKindDetails = ResourceTypeOrKindDetails & {
            /**
             * The array of kinds which is represented by this kind.
             */
            readonly kinds?: ReadonlyArray<string>;
        }

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
            readonly browseOption?: AssetTypes.ArgBrowseOptions;

            /**
             * The ARM browse option that the extension has chosen for this resource/asset type.
             */
            readonly armBrowseOption?: AssetTypes.ArmBrowseOptions;

            /**
             * A map representing the various kinds supported by this resource type.
             */
            readonly kindMap?: ReadonlyStringMap<ResourceKindDetails>;

            /**
             * The default kind, if there is one.
             */
            readonly defaultKind?: Readonly<ResourceKindDetails>;

            /**
             * The contracts for the asset type.
             */
            readonly contracts: Assets.AssetTypeContracts;

            /**
             * The browse type for the asset type.
             */
            readonly browseType: AssetTypes.BrowseType;

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
             * The deployment blade associated with the asset
             */
            readonly postCreateBlade?: Assets.PostCreateBladeReference;

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
            readonly links?: ReadonlyArray<Assets.Link>;

            /**
             * The hidden commands list for asset type.
             */
            readonly hiddenCommands?: ReadonlyArray<string>;

            /**
             * The browse command layout experiments.
             */
            readonly browseCommandExperiments?: ReadonlyStringMap<Assets.AssetTypeBrowseCommandLayout>;

            /**
             * The routing type for the resource type.
             */
            readonly routingType?: number;

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
            readonly proxyRoutingFilters?: Assets.ProxyRoutingFilter[];

            /**
             * The API resource type for ARM.
             * This is only valid for tenant-routing resources.
             */
            readonly topLevelTenantAlias?: string;

            /**
             * The optional map of command ids to api-versions per resource type for a given asset type.
             * This is used to override default api-versions in extensible ARM bulk command definitions.
             */
            readonly extensibleCommandsApiVersions?: ReadonlyStringMap<ReadonlyStringMap<string>>;

        }
    }

    export namespace ArgInterfaces {
        /**
         * A data point in a response from ART.
         */
        export type ARTDataPoint = string | number | object;

        /**
         * A data row in a response from ART.
         */
        export type ARTDataRow = ReadonlyArray<ARTDataPoint>;

        /**
         * The column response from ART.
         */
        export interface ARTColumnResponse {
            /**
             * The name of the column.
             */
            readonly name: string;

            /**
             * The type of the column.
             */
            readonly type: string;
        }

        /**
         * The data response from ART.
         */
        export interface ARTDataResponse {
            /**
             * ART data rows.
             */
            readonly rows: ReadonlyArray<ARTDataRow>;

            /**
             * The list of columns.
             */
            readonly columns: ReadonlyArray<ARTColumnResponse>;
        }

        /**
         * The facet response from ART.
         */
        export interface ARTFacetResponse {
            /**
             * Flag suggesting if the facet expression specified in the query is valid or not.
             */
            readonly valid: boolean;

            /**
             * The facet expression.
             */
            readonly expression: string;

            /**
             * Data including rows and columns.
             */
            readonly data: ARTDataResponse;
        }

        /**
         * The ART response.
         */
        export interface ARTResponse {
            /**
             * Data including rows.
             */
            readonly data: ARTDataResponse;

            /**
             * Boolean indicating if paging is enabled.
             */
            readonly pagingEnabled?: boolean;

            /**
             * ART data facets.
             */
            readonly facets?: ARTFacetResponse[];

            /**
             * Total records matching the specified query.
             */
            readonly totalRecords?: number;

            /**
             * The number of records returned in the current query.
             */
            readonly count?: number;

            /**
             * The offset of the items in the current page.
             */
            readonly offset?: number;

            /**
             * The skip token if paging is enabled.
             */
            readonly $skipToken?: string;

            /**
             * The correlation ID for the call to the backend.
             */
            readonly correlationId?: string;

            /**
             * A flag indicating that the results returned in the `data` property are ordered indeterministically and paginated results are not guaranteed to be accurate.
             */
            readonly resultTruncated?: "true" | "false";

            /**
             * The http status code of the response from the backend.
             */
            readonly httpStatusCode?: Ajax.HttpStatusCode;
        }
    }

    export namespace Experimentation {
        interface SetExtensionFlightsOptions {
            readonly flights: ReadonlyArray<string>;
            readonly assignmentContext: string;
            readonly variables: Record<string, string | number | boolean>;
            [key: string]: any;
        }

        interface ExperimentationProvider {
            _data: SetExtensionFlightsOptions;
        }

        interface Experimentation {
            getAssignments(): Promise<ExperimentationProvider>;
        }
    }

    export namespace Authentication {
        /**
         * The parameters callers may provide that will be passed to the authentication provider.
         */
        type AllowedSignInParameters = "amr_values" | "acr_values" | "claims";

        /**
         * The options for forcing the user to sign in again.
         */
        interface ForceSignInOptions {
            /**
             * The reason for forcing the user to sign in.
             */
            readonly reason: string;

            /**
             * The blade to launch upon successful sign in.
             */
            readonly bladeReference?: SimpleBladeReference;

            /**
             * Optional map of query parameters and values to pass to the authentication provider.
             */
            readonly signInParameters?: Partial<Record<AllowedSignInParameters, string>>;

            /**
             * The tenant ID or directory name to sign into.
             */
            readonly tenantId?: string;
        }

        /**
         * Interface for authentication tokens received by the extension.
         */
        export type AuthorizationToken = {
            /**
             * The authorization header needed to make API calls to a service.
             */
            readonly header: string;

            /**
             * The time at which the token expires.
             */
            readonly expiresAt: number;
        };

        /**
         * Options supplied to 'getPopToken'.
         */
        export type GetPopTokenOptions = {
            /**
             * The scopes required on the PoP token.
             */
            readonly scopes: string[];

            /**
             * The all-caps name of the HTTP method of the request that will use the signed token (GET, POST, PUT, etc.)
             */
            readonly resourceRequestMethod: string;

            /**
             * The URL of the protected resource for which the access token is being issued
             */
            readonly resourceRequestUri: string;

            /**
             * A stringified JSON object containing custom client claims to be added to the PoP token.
             */
            readonly shrClaims?: string;

            /**
             * A server-generated, signed timestamp that is Base64URL encoded as a string. This nonce is used to
             * mitigate clock-skew and time-travel attacks meant to enable PoP token pre-generation.
             */
            readonly shrNonce?: string;
        };
    }

    /**
     * Internal implementation use.
     */
    namespace DataCache {
        /**
         * Expiration types, all APIs default to caching for the lifetime of the current portal instance.
         */
        const enum Expiration {
            /**
             * Cache is kept local to this view instance.
             */
            OnViewClose = "ViewClose",
            /**
             * Cache is kept until this portal is closed, or manually cleared.
             */
            OnPortalClose = "PortalClose",
        }

        type ClearedEntry = {
            kind: "cleared";
            timestamp: number;
        }

        type CacheEntry = {
            expires: number | Expiration;
            // The timestamp when cache data promise is resolved, not when the cache entry is added
            // once we support "pending" cache entry, this timestamp should be the time it's added
            timestamp: number;
        } & CacheEntryData;

        type CacheEntryData = ({
            kind: "resolved";
            data: any;
        } | {
            kind: "rejected";
            serializableError: string;
        });
    }

    /**
     * Internal implementation use.
     */
    export interface ProxiedFx {
        ___ajax___getEndpoints: {
            returns: Ajax.Endpoints;
        };
        ___ajax___batch: {
            parameters: Ajax.BatchSettings;
            /**
             * 'responseHeaders' is of a class type and isn't serializable. It will be recreated by the caller.
             */
            returns: Omit<Ajax.BatchResponseItem<any>, "responseHeaders">;
        };
        ___ajax___batchMultiple: {
            parameters: Ajax.BatchMultipleSettings;
            /**
             * 'responseHeaders' is of a class type and isn't serializable. It will be recreated by the caller.
             */
            returns: Omit<Ajax.BatchResponse, "responses"> & { responses: ReadonlyArray<Omit<Ajax.BatchResponseItem<any>, "responseHeaders">> };
        };
        ___ajax___ajax: {
            parameters: any;
            returns: any;
        };
        ___resources___getContentUri: {
            parameters: string;
            returns: string;
        };
        ___resources___getAbsoluteUri: {
            parameters: string;
            returns: string;
        };
        ___policyDataCore___policyJourney: {
            parameters: PolicyDataCoreModels.Internal.PolicyDataCoreOptionsType;
            returns: PolicyDataCoreModels.Internal.PolicyDataCoreResultType;
        };
        ___experiments___getAssignments: {
            returns: Experimentation.SetExtensionFlightsOptions;
        };
        ___ajax___trace: {
            parameters: {
                request: {
                    uri: string;
                    type?: string;
                    headers?: ReadonlyStringMap<any>;
                    dataSentBytes: number;
                    data?: string;
                };
                response: {
                    status?: number;
                    dataReceivedBytes?: number;
                    isError?: boolean;
                    responseCorrelationId?: string;
                    responseText?: string;
                };
                startTime: number;
                endTime: number;
                bladeContext: { id: string; instanceId: string };
            };
        };
        ___ajax___isTrustedDomain: {
            parameters: string;
            returns: boolean;
        };
        ___diagnostics___trace: {
            parameters: {
                events: ReadonlyArray<{
                    timestamp: number;
                    source: string;
                    action: string;
                    actionModifier?: string;
                    duration?: number;
                    name?: string;
                    data?: any;
                }>,
                telemetryContext: Partial<Record<"Blade" | "Part", { id: string; instanceId: string }>>,
            },
        },
        ___diagnostics___log: {
            parameters: {
                entries: ReadonlyArray<{
                    timestamp: number;
                    level: number;
                    area: string;
                    entryType?: string;
                    message: string;
                    code?: number;
                    args?: ReadonlyArray<any>;
                }>,
            },
        },
        ___ajax___isTrustedDomainOverride: {
            parameters: string;
            returns: boolean;
        };
        ___dataCache___addPromise: {
            parameters: {
                id: string,
                expires: number | DataCache.Expiration,
            },
        };
        ___dataCache___get: {
            parameters: {
                id: string,
                undefinedOnEmpty?: boolean,
            },
            returns: DataCache.CacheEntry | DataCache.ClearedEntry,
        };
        ___dataCache___add: {
            parameters: {
                id: string,
                value: any,
                expires: number | DataCache.Expiration,
                viewName: string,
            },
        };
        ___dataCache___clear: {
            parameters: {
                type?: DataCache.Expiration,
            },
        };
        ___dataCache___clearItem: {
            parameters: {
                id: string,
            },
        };
        ___dataCache___onViewClose: {
            parameters: {
                viewName: string,
            },
        };
    }

    /**
     * Argument for CloudShell commands
     */
    interface CloudShellCommandArg {
        /**
         * Name of the argument
         */
        prop: string;
        /**
         * Value of the argument
         */
        value?: string;
    }

    /**
     * Command that will be run on CloudShell
     */
    interface CloudShellCommand {
        /**
         * Name of the command
         */
        name: string;
        /**
         * Argument or argument list for the command
         */
        args?: CloudShellCommandArg | CloudShellCommandArg[];
    }

    /**
     * Options for validating required permissions for an ARM resource.
     */
    export interface ArmRequiredPermissions {
        /**
         * The list of required actions/permissions.
         */
        actions: string[];

        /**
         * The message to show in case validation fails.
         */
        message?: string;
    }

    export namespace TelemetryInsights {
        /**
         * Base result structure of a Kusto query for Telemetry Insights.
         */
        export interface InsightBase {
            /**
             * Blade name.
             */
            readonly Blade: string;
            /**
             * Name of telemetry item.
             */
            readonly Name: string;
            /**
             * Number of users.
             */
            readonly Users: number;
            /**
             * Number of sessions.
             */
            readonly Sessions: number;
            /**
             * Number of tenants.
             */
            readonly Tenants: number;
            /**
             * Percent of total users.
             */
            readonly PctOfTotalUsers: number;
            /**
             * Percent of total sessions.
             */
            readonly PctOfTotalSessions: number;
            /**
             * Percent of total tenants.
             */
            readonly PctOfTotalTenants: number;
            /**
             * Percentage class to determine heatmap color.
             */
            readonly percentageClass: string;
        }

        /**
         * Result of the CommandSummary Kusto Query
         */
        export interface CommandBarInsight extends InsightBase {
            /**
             * Button clicks.
             */
            readonly Clicks: number;
            /**
             * Percent of total button clicks.
             */
            readonly PctOfTotalClicks: number;
            /**
             * Total clicks.
             */
            readonly TotalClicks: number;
        }

        /**
         * Result of the MenuSummary Kusto Query
         */
        export interface MenuInsight extends InsightBase {
            /**
             * Resource type.
             */
            readonly Type: string;
            /**
             * Menu item loads.
             */
            readonly Loads: number;
            /**
             * Total loads.
             */
            readonly TotalLoads: number;
            /**
             * Percent of total menu item loads.
             */
            readonly PctOfTotalLoads: number;
        }

        /**
         * Result of the Tabs Kusto Query
         */
        export interface TabInsight {
            /**
             * Source e.g. the full blade name.
             */
            readonly Source: string;
            /**
             * Extension name.
             */
            readonly Extension: string;
            /**
             * Blade name.
             */
            readonly BladeName: string;
            /**
             * Tab index.
             */
            readonly TabIndex: string;
            /**
             * Tab name.
             */
            readonly Name: string;
            /**
             * Tab loads.
             */
            readonly Loads: number;
            /**
             * Percentage of total loads.
             */
            readonly PctOfTotalLoads: number;
            /**
             * Percentage class to determine heatmap color.
             */
            readonly percentageClass: string;
        }

        /**
         * Result of the InBlade Kusto Query
         */
        export interface InBladeInsight {
            /**
             * Element selector.
             */
            readonly selector: string;
            /**
             * Telemetry target name.
             */
            readonly name: string;
            /**
             * Number of clicks.
             */
            readonly Clicks: number;
            /**
             * Percent of total clicks.
             */
            readonly PctClicks: number;
            /**
             * Total number of clicks.
             */
            readonly TotalClicks: number;
            /**
             * Percentage class to determine heatmap color.
             */
            readonly percentageClass: string;
        }

        /**
         * result of the Comment Kusto Query
         */
        export interface CommentInsight {
            /**
             * Timestamp.
             */
            readonly TIMESTAMP: Date;
            /**
             * CES value.
             */
            readonly d_CESValue: number;
            /**
             * CVA value.
             */
            readonly d_CVAValue: number;
            /**
             * Comments.
             */
            readonly d_comments: string;
        }

        /**
         * Type of telemetry data to be sent to Matrix.
         */
        export const enum InsightsTelemetryType {
            CMD = "commandbar",
            TAB = "tab",
            BLADE = "blade",
        }

        /**
         * Telemetry data and type to be sent to Matrix.
         */
        export type InsightsTelemetry = ({
            /**
             * Type of telemetry data to display.
             */
            readonly type: InsightsTelemetryType.CMD;
            /**
             * Telemetry data to display.
             */
            readonly data: CommandBarInsight[];
        } | {
            /**
             * Type of telemetry data to display.
             */
            readonly type: InsightsTelemetryType.TAB;
            /**
             * Telemetry data to display.
             */
            readonly data: TabInsight[];
        } | {
            /**
             * Type of telemetry data to display.
             */
            readonly type: InsightsTelemetryType.BLADE;
            /**
             * Telemetry data to display.
             */
            readonly data: InBladeInsight[];
        }) & {
            /**
             * Kusto query for the telemetry data.
             */
            readonly query: string;
        }
    }
}

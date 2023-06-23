// Compiled with TypeScript 5.0

// FILE: FxObsolete\Controls\BaseResourceDropDown.d.ts
declare module "FxObsolete/Controls/BaseResourceDropDown" {
    export = Main;
    module Main {
        /**
         * FxObsolete/Controls/BaseResourceDropDown.Contract is obsolete. Please use Fx/Controls/BaseResourceDropDown instead.
         *
         * @see {@link https://aka.ms/portalfx/breaking} for further information.
         * The contract for legacy controls
         * It has a different item structure and a helper to find objects by name
         */
        type Contract = Obsolete;
        /**
         * FxObsolete/Controls/BaseResourceDropDown.Options is obsolete. Please use Fx/Controls/BaseResourceDropDown instead.
         *
         * @see {@link https://aka.ms/portalfx/breaking} for further information.
         * The contract for legacy controls
         * It has a different item structure and a helper to find objects by name
         */
        type Options = Obsolete;
        /**
         * FxObsolete/Controls/BaseResourceDropDown.ResourceGroupOptions is obsolete. Please use Fx/Controls/BaseResourceDropDown instead.
         *
         * @see {@link https://aka.ms/portalfx/breaking} for further information.
         */
        type ResourceGroupOptions = Obsolete;
        /**
         * FxObsolete/Controls/BaseResourceDropDown.LocationOptions is obsolete. Please use Fx/Controls/BaseResourceDropDown instead.
         *
         * @see {@link https://aka.ms/portalfx/breaking} for further information.
         */
        type LocationOptions = Obsolete;
    }
}

// FILE: FxObsolete\Controls\LocationDropDown.d.ts
declare module "FxObsolete/Controls/LocationDropDown" {
    import { Location as BaseLocation } from "Fx/Controls/BaseResourceDropDown";
    import { HtmlContent } from "Fx/Controls/ControlsBase";
    export = Main;
    module Main {
        import FxViewModels = MsPortalFx.ViewModels;
        /**
         * The contract for options to create the location drop down
         */
        export type Options<THtmlKeyMap extends StringMap<HtmlContent> = StringMap<HtmlContent>> = BaseLocation.BaseOptions<THtmlKeyMap>;
        /**
         * The contract for the location dropdown
         */
        export interface Contract extends BaseLocation.Contract {
        }
        function obsoleteCreate(container: FxViewModels.ContainerContract, legacyOptions?: Options): Contract;
        export type ObsoleteCreateType = typeof obsoleteCreate;
        /**
         * FxObsolete/Controls/LocationDropDown.create has been obsoleted.
         * Use Fx/Controls/LocationDropDown instead.
         * Please refer to https://aka.ms/portalfx/breaking for more details.
         */
        export const create: Obsolete;
        export {};
    }
}

// FILE: FxObsolete\Controls\ResourceGroupDropDown.d.ts
declare module "FxObsolete/Controls/ResourceGroupDropDown" {
    import { ResourceGroup } from "Fx/Controls/BaseResourceDropDown";
    import { HtmlContent } from "Fx/Controls/ControlsBase";
    export = Main;
    module Main {
        import FxViewModels = MsPortalFx.ViewModels;
        /**
         * The contract for options to create the subscription drop down
         */
        type Options<THtmlKeyMap extends StringMap<HtmlContent> = StringMap<HtmlContent>> = ResourceGroup.BaseOptions<THtmlKeyMap>;
        /**
         * The contract for the subscription dropdown
         */
        interface Contract extends ResourceGroup.Contract {
        }
        function obsoleteCreate(container: FxViewModels.ContainerContract, legacyOptions?: Options): Contract;
        export type ObsoleteCreateType = typeof obsoleteCreate;
        /**
         * FxObsolete/Controls/ResourceGroupDropDown.create has been obsoleted.
         * Use Fx/Controls/ResourceGroupDropDown instead.
         * Please refer to https://aka.ms/portalfx/breaking for more details.
         */
        export const create: Obsolete;
        export {};
    }
}

// FILE: FxObsolete\Controls\SubscriptionDropDown.d.ts
declare module "FxObsolete/Controls/SubscriptionDropDown" {
    import { Subscription } from "Fx/Controls/BaseResourceDropDown";
    import { HtmlContent } from "Fx/Controls/ControlsBase";
    export = Main;
    module Main {
        import FxViewModels = MsPortalFx.ViewModels;
        /**
         * The contract for options to create the subscription drop down
         */
        type Options<THtmlKeyMap extends StringMap<HtmlContent> = StringMap<HtmlContent>> = Subscription.BaseOptions<THtmlKeyMap>;
        /**
         * The contract for the subscription dropdown
         */
        interface Contract extends Subscription.Contract {
            /**
             * An observable which holds the string id of the subscription
             */
            subscriptionId: KnockoutObservableBase<string>;
        }
        function obsoleteCreate(container: FxViewModels.ContainerContract, legacyOptions?: Options): Contract;
        export type ObsoleteCreateType = typeof obsoleteCreate;
        /**
         * FxObsolete/Controls/SubscriptionDropDown.create has been obsoleted.
         * Use Fx/Controls/SubscriptionDropDown instead.
         * Please refer to https://aka.ms/portalfx/breaking for more details.
         */
        export const create: Obsolete;
        export {};
    }
}

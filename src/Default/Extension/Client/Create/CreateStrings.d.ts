declare module "Create/CreateStrings" {
    export = CreateStrings;
    const CreateStrings: {
        /**
         * The text "Create My Resource"
         */
        readonly createTitle: string;
        /**
         * The text "Name should contain only alphanumeric characters, up to 30 characters long."
         */
        readonly resourceNameTooltip: string;
        /**
         * The text "Only alphanumeric characters are allowed, and the value must be 1-30 characters long."
         */
        readonly resourceNameValidationMessage: string;
        /**
         * The text "Add a description of your service here to quickly introduce your service to customers. Also add a Learn More link that links to documentation or Azure's marketing site for your resource type. [Learn more](https://azure.microsoft.com/)"
         */
        readonly step1Description: string;
        /**
         * The text "Basics"
         */
        readonly step1Label: string;
        /**
         * The text "Tags"
         */
        readonly tags: string;
    };
}
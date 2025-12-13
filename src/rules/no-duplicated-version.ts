import { createRule } from "../utils";

export const noDuplicatedVersion = createRule({
    name: "no-duplicated-version",
    meta: {
        type: "problem",
        docs: {
            description:
                "Disallow multiple version definitions in citty commands within the same file",
        },
        messages: {
            duplicate:
                "Version is defined multiple times. It should be defined only once.",
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        let versionCount = 0;

        return {
            CallExpression(node) {
                if (
                    node.callee.type === "Identifier" &&
                    node.callee.name === "defineCommand" &&
                    node.arguments.length > 0
                ) {
                    const arg = node.arguments[0];
                    if (arg.type === "ObjectExpression") {
                        const metaProperty = arg.properties.find(
                            (property) =>
                                property.type === "Property" &&
                                property.key.type === "Identifier" &&
                                property.key.name === "meta"
                        );

                        if (
                            metaProperty &&
                            metaProperty.value.type === "ObjectExpression"
                        ) {
                            const versionProperty =
                                metaProperty.value.properties.find(
                                    (property: {
                                        type: string;
                                        key: { type: string; name: string };
                                    }) =>
                                        property.type === "Property" &&
                                        property.key.type === "Identifier" &&
                                        property.key.name === "version"
                                );

                            if (versionProperty) {
                                versionCount++;
                                if (versionCount > 1) {
                                    context.report({
                                        node: versionProperty,
                                        messageId: "duplicate",
                                    });
                                }
                            }
                        }
                    }
                }
            },
        };
    },
});

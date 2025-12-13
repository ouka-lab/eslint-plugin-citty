import { createRule } from "../utils";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";

export const aliasShouldBeShort = createRule({
    name: "alias-should-be-short",
    meta: {
        type: "suggestion",
        docs: {
            description:
                "Warn when alias is not shorter than the argument name",
        },
        messages: {
            aliasNotShort:
                'Alias "{{alias}}" should be shorter than the argument name "{{name}}".',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            CallExpression(node) {
                if (
                    node.callee.type === AST_NODE_TYPES.Identifier &&
                    node.callee.name === "defineCommand" &&
                    node.arguments.length > 0
                ) {
                    const arg = node.arguments[0];
                    if (arg.type === AST_NODE_TYPES.ObjectExpression) {
                        const argsProperty = arg.properties.find(
                            (property) =>
                                property.type === AST_NODE_TYPES.Property &&
                                property.key.type ===
                                    AST_NODE_TYPES.Identifier &&
                                property.key.name === "args"
                        );

                        if (
                            argsProperty &&
                            argsProperty.type === AST_NODE_TYPES.Property &&
                            argsProperty.value.type ===
                                AST_NODE_TYPES.ObjectExpression
                        ) {
                            for (const argDef of argsProperty.value
                                .properties) {
                                if (
                                    argDef.type === AST_NODE_TYPES.Property &&
                                    argDef.key.type ===
                                        AST_NODE_TYPES.Identifier &&
                                    argDef.value.type ===
                                        AST_NODE_TYPES.ObjectExpression
                                ) {
                                    const argName = argDef.key.name;
                                    const properties = argDef.value.properties;

                                    const aliasProp = properties.find(
                                        (p) =>
                                            p.type ===
                                                AST_NODE_TYPES.Property &&
                                            p.key.type ===
                                                AST_NODE_TYPES.Identifier &&
                                            p.key.name === "alias"
                                    );

                                    if (
                                        aliasProp &&
                                        aliasProp.type ===
                                            AST_NODE_TYPES.Property
                                    ) {
                                        const checkAlias = (
                                            aliasValue: string,
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            nodeToReport: any
                                        ) => {
                                            if (
                                                aliasValue.length >=
                                                argName.length
                                            ) {
                                                context.report({
                                                    node: nodeToReport,
                                                    messageId: "aliasNotShort",
                                                    data: {
                                                        alias: aliasValue,
                                                        name: argName,
                                                    },
                                                });
                                            }
                                        };

                                        if (
                                            aliasProp.value.type ===
                                                AST_NODE_TYPES.Literal &&
                                            typeof aliasProp.value.value ===
                                                "string"
                                        ) {
                                            checkAlias(
                                                aliasProp.value.value,
                                                aliasProp.value
                                            );
                                        } else if (
                                            aliasProp.value.type ===
                                            AST_NODE_TYPES.ArrayExpression
                                        ) {
                                            for (const element of aliasProp
                                                .value.elements) {
                                                if (
                                                    element &&
                                                    element.type ===
                                                        AST_NODE_TYPES.Literal &&
                                                    typeof element.value ===
                                                        "string"
                                                ) {
                                                    checkAlias(
                                                        element.value,
                                                        element
                                                    );
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        };
    },
});

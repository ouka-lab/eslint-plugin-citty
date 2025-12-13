import { createRule } from "../utils";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import type { TSESTree } from "@typescript-eslint/utils";

const CORRECT_ORDER = [
    "meta",
    "args",
    "setup",
    "run",
    "cleanup",
    "subCommands",
];

const ORDER_MAP = new Map(CORRECT_ORDER.map((key, index) => [key, index]));

function getKey(node: TSESTree.Property) {
    if (node.key.type === AST_NODE_TYPES.Identifier) {
        return node.key.name;
    }
    if (
        node.key.type === AST_NODE_TYPES.Literal &&
        typeof node.key.value === "string"
    ) {
        return node.key.value;
    }
    return null;
}

export const sortDefineCommandProperties = createRule({
    name: "sort-define-command-properties",
    meta: {
        type: "suggestion",
        docs: {
            description:
                "Enforce a specific order for properties in defineCommand.",
        },
        messages: {
            incorrectOrder:
                "Properties in defineCommand should be in the order: meta, args, setup, run, cleanup, subCommands.",
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            CallExpression(node) {
                if (
                    node.callee.type !== AST_NODE_TYPES.Identifier ||
                    node.callee.name !== "defineCommand" ||
                    node.arguments.length === 0
                ) {
                    return;
                }

                const arg = node.arguments[0];
                if (arg.type !== AST_NODE_TYPES.ObjectExpression) {
                    return;
                }

                const properties = arg.properties.filter(
                    (p): p is TSESTree.Property =>
                        p.type === AST_NODE_TYPES.Property
                );

                if (properties.length < 2) {
                    return;
                }

                const keys = properties
                    .map(getKey)
                    .filter((k): k is string => k !== null && ORDER_MAP.has(k));

                let lastOrderIndex = -1;
                for (const key of keys) {
                    const currentOrderIndex = ORDER_MAP.get(key)!;
                    if (currentOrderIndex < lastOrderIndex) {
                        context.report({
                            node: arg,
                            messageId: "incorrectOrder",
                        });
                        return;
                    }
                    lastOrderIndex = currentOrderIndex;
                }
            },
        };
    },
});

import { createRule } from "../utils";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";

export const noHiddenRootCommand = createRule({
    name: "no-hidden-root-command",
    meta: {
        type: "suggestion",
        docs: {
            description:
                "Disallow hidden property in root commands (main/index exports)",
        },
        messages: {
            meaninglessHidden:
                'The "hidden" property is meaningless for the root command.',
        },
        fixable: "code",
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
                    // Check if hidden: true is present
                    const arg = node.arguments[0];
                    if (arg.type !== AST_NODE_TYPES.ObjectExpression) return;

                    const metaProperty = arg.properties.find(
                        (property) =>
                            property.type === AST_NODE_TYPES.Property &&
                            property.key.type === AST_NODE_TYPES.Identifier &&
                            property.key.name === "meta"
                    );

                    if (
                        !metaProperty ||
                        metaProperty.type !== AST_NODE_TYPES.Property ||
                        metaProperty.value.type !==
                            AST_NODE_TYPES.ObjectExpression
                    ) {
                        return;
                    }

                    const hiddenProperty = metaProperty.value.properties.find(
                        (property) =>
                            property.type === AST_NODE_TYPES.Property &&
                            property.key.type === AST_NODE_TYPES.Identifier &&
                            property.key.name === "hidden"
                    );

                    if (
                        !hiddenProperty ||
                        hiddenProperty.type !== AST_NODE_TYPES.Property ||
                        hiddenProperty.value.type !== AST_NODE_TYPES.Literal ||
                        hiddenProperty.value.value !== true
                    ) {
                        return;
                    }

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const report = (nodeToReport: any) => {
                        context.report({
                            node: nodeToReport,
                            messageId: "meaninglessHidden",
                            fix(fixer) {
                                const sourceCode = context.sourceCode;
                                const tokenAfter =
                                    sourceCode.getTokenAfter(nodeToReport);
                                if (tokenAfter && tokenAfter.value === ",") {
                                    return fixer.removeRange([
                                        nodeToReport.range[0],
                                        tokenAfter.range[1],
                                    ]);
                                }
                                return fixer.remove(nodeToReport);
                            },
                        });
                    };

                    // Check if it is a root command
                    // Condition 1: export default defineCommand(...)
                    if (
                        node.parent.type ===
                        AST_NODE_TYPES.ExportDefaultDeclaration
                    ) {
                        report(hiddenProperty);
                        return;
                    }

                    // Condition 2: export const main = defineCommand(...) OR export const root = defineCommand(...)
                    if (
                        node.parent.type ===
                            AST_NODE_TYPES.VariableDeclarator &&
                        node.parent.id.type === AST_NODE_TYPES.Identifier &&
                        ["main", "root", "index"].includes(
                            node.parent.id.name
                        ) &&
                        node.parent.parent.type ===
                            AST_NODE_TYPES.VariableDeclaration &&
                        node.parent.parent.parent.type ===
                            AST_NODE_TYPES.ExportNamedDeclaration
                    ) {
                        report(hiddenProperty);
                        return;
                    }
                }
            },
        };
    },
});

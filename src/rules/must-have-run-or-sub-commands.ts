import { createRule } from '../utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

export const mustHaveRunOrSubCommands = createRule({
  name: 'must-have-run-or-sub-commands',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce that a command has either `run` or `subCommands` defined',
    },
    messages: {
      missingRunOrSubCommands: 'A command must have either "run" or "subCommands" defined.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type === AST_NODE_TYPES.Identifier &&
          node.callee.name === 'defineCommand' &&
          node.arguments.length > 0
        ) {
          const arg = node.arguments[0];
          if (arg.type === AST_NODE_TYPES.ObjectExpression) {
            const hasRun = arg.properties.some(
              (property) =>
                property.type === AST_NODE_TYPES.Property &&
                property.key.type === AST_NODE_TYPES.Identifier &&
                property.key.name === 'run'
            );

            const hasSubCommands = arg.properties.some(
              (property) =>
                property.type === AST_NODE_TYPES.Property &&
                property.key.type === AST_NODE_TYPES.Identifier &&
                property.key.name === 'subCommands'
            );

            if (!hasRun && !hasSubCommands) {
              context.report({
                node: arg,
                messageId: 'missingRunOrSubCommands',
              });
            }
          }
        }
      },
    };
  },
});

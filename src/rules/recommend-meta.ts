import { createRule } from '../utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

export const recommendMeta = createRule({
  name: 'recommend-meta',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Recommend that a command has `meta` property defined',
    },
    messages: {
      missingMeta: 'It is recommended to define "meta" property for better documentation.',
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
            const hasMeta = arg.properties.some(
              (property) =>
                property.type === AST_NODE_TYPES.Property &&
                property.key.type === AST_NODE_TYPES.Identifier &&
                property.key.name === 'meta'
            );

            if (!hasMeta) {
              context.report({
                node: arg,
                messageId: 'missingMeta',
              });
            }
          }
        }
      },
    };
  },
});

import { createRule } from '../utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

export const noMeaninglessValueHint = createRule({
  name: 'no-meaningless-value-hint',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow valueHint when it is meaningless (boolean type or enum specified)',
    },
    messages: {
      meaninglessBoolean: 'valueHint is meaningless for boolean arguments.',
      meaninglessEnum: 'valueHint is meaningless when enum is specified.',
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
            const argsProperty = arg.properties.find(
              (property) =>
                property.type === AST_NODE_TYPES.Property &&
                property.key.type === AST_NODE_TYPES.Identifier &&
                property.key.name === 'args'
            );

            if (
              argsProperty &&
              argsProperty.type === AST_NODE_TYPES.Property &&
              argsProperty.value.type === AST_NODE_TYPES.ObjectExpression
            ) {
              for (const argDef of argsProperty.value.properties) {
                if (
                  argDef.type === AST_NODE_TYPES.Property &&
                  argDef.value.type === AST_NODE_TYPES.ObjectExpression
                ) {
                  const properties = argDef.value.properties;
                  
                  const valueHintProp = properties.find(
                    (p) =>
                      p.type === AST_NODE_TYPES.Property &&
                      p.key.type === AST_NODE_TYPES.Identifier &&
                      p.key.name === 'valueHint'
                  );

                  if (!valueHintProp) {
                    continue;
                  }

                  // Check for type: Boolean or type: 'boolean'
                  const typeProp = properties.find(
                    (p) =>
                      p.type === AST_NODE_TYPES.Property &&
                      p.key.type === AST_NODE_TYPES.Identifier &&
                      p.key.name === 'type'
                  );

                  if (typeProp && typeProp.type === AST_NODE_TYPES.Property) {
                    if (
                      (typeProp.value.type === AST_NODE_TYPES.Identifier &&
                        typeProp.value.name === 'Boolean') ||
                      (typeProp.value.type === AST_NODE_TYPES.Literal &&
                        typeProp.value.value === 'boolean')
                    ) {
                      context.report({
                        node: valueHintProp,
                        messageId: 'meaninglessBoolean',
                      });
                      continue; // Skip enum check if already reported for boolean
                    }
                  }

                  // Check for enum property
                  const enumProp = properties.find(
                    (p) =>
                      p.type === AST_NODE_TYPES.Property &&
                      p.key.type === AST_NODE_TYPES.Identifier &&
                      p.key.name === 'enum'
                  );

                  if (enumProp) {
                    context.report({
                      node: valueHintProp,
                      messageId: 'meaninglessEnum',
                    });
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

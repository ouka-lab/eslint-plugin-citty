import { createRule } from '../utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

export const recommendNameAndDescriptionInArgs = createRule({
  name: 'recommend-name-and-description-in-args',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Recommend that an arg has `name` and `description` properties defined',
    },
    messages: {
      missingName: 'It is recommended to define "name" property for better documentation.',
      missingDescription: 'It is recommended to define "description" property for better documentation.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          check: {
            type: 'array',
            items: {
              enum: ['name', 'description'],
            },
            minItems: 1,
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ check: ['name', 'description'] }],
  create(context) {
    const options = context.options[0];
    const checkName = options.check.includes('name');
    const checkDescription = options.check.includes('description');

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
              for (const argProperty of argsProperty.value.properties) {
                if (
                  argProperty.type === AST_NODE_TYPES.Property &&
                  argProperty.value.type === AST_NODE_TYPES.ObjectExpression
                ) {
                  const hasName = argProperty.value.properties.some(
                    (p) =>
                      p.type === AST_NODE_TYPES.Property &&
                      p.key.type === AST_NODE_TYPES.Identifier &&
                      p.key.name === 'name'
                  );
                  const hasDescription = argProperty.value.properties.some(
                    (p) =>
                      p.type === AST_NODE_TYPES.Property &&
                      p.key.type === AST_NODE_TYPES.Identifier &&
                      p.key.name === 'description'
                  );

                  if (checkName && !hasName) {
                    context.report({
                      node: argProperty,
                      messageId: 'missingName',
                    });
                  }
                  if (checkDescription && !hasDescription) {
                    context.report({
                      node: argProperty,
                      messageId: 'missingDescription',
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

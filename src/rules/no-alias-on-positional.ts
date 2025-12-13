import { createRule } from '../utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

export const noAliasOnPositional = createRule({
  name: 'no-alias-on-positional',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow alias property on positional arguments',
    },
    messages: {
      noAlias: 'Positional arguments cannot have aliases.',
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

                  // Check for type: "positional"
                  const typeProp = properties.find(
                    (p) =>
                      p.type === AST_NODE_TYPES.Property &&
                      p.key.type === AST_NODE_TYPES.Identifier &&
                      p.key.name === 'type'
                  );

                  const isPositional =
                    typeProp &&
                    typeProp.type === AST_NODE_TYPES.Property &&
                    typeProp.value.type === AST_NODE_TYPES.Literal &&
                    typeProp.value.value === 'positional';

                  if (!isPositional) {
                    continue;
                  }

                  // Check for alias property
                  const aliasProp = properties.find(
                    (p) =>
                      p.type === AST_NODE_TYPES.Property &&
                      p.key.type === AST_NODE_TYPES.Identifier &&
                      p.key.name === 'alias'
                  );

                  if (aliasProp) {
                    context.report({
                      node: aliasProp,
                      messageId: 'noAlias',
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

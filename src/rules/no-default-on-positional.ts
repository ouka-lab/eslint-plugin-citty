import { createRule } from '../utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

export const noDefaultOnPositional = createRule({
  name: 'no-default-on-positional',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow default property on positional arguments',
    },
    messages: {
      meaninglessDefault: 'Positional arguments cannot have default values.',
    },
    fixable: 'code',
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

                  // Check for default property
                  const defaultProp = properties.find(
                    (p) =>
                      p.type === AST_NODE_TYPES.Property &&
                      p.key.type === AST_NODE_TYPES.Identifier &&
                      p.key.name === 'default'
                  );

                  if (defaultProp) {
                    context.report({
                      node: defaultProp,
                      messageId: 'meaninglessDefault',
                      fix(fixer) {
                         const sourceCode = context.sourceCode;
                         const tokenAfter = sourceCode.getTokenAfter(defaultProp);
                         if (tokenAfter && tokenAfter.value === ',') {
                            return fixer.removeRange([defaultProp.range[0], tokenAfter.range[1]]);
                         }
                         return fixer.remove(defaultProp);
                      },
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

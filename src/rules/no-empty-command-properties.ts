import { createRule } from '../utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

export const noEmptyCommandProperties = createRule({
  name: 'no-empty-command-properties',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow empty implementations for run, setup, cleanup, and subCommands',
    },
    messages: {
      emptyProperty: 'Property "{{name}}" is defined but empty. It should be removed or implemented.',
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
            for (const property of arg.properties) {
              if (
                property.type === AST_NODE_TYPES.Property &&
                property.key.type === AST_NODE_TYPES.Identifier
              ) {
                const name = property.key.name;
                
                // Check subCommands
                if (name === 'subCommands') {
                  if (
                    property.value.type === AST_NODE_TYPES.ObjectExpression &&
                    property.value.properties.length === 0
                  ) {
                    context.report({
                      node: property,
                      messageId: 'emptyProperty',
                      data: { name },
                      fix(fixer) {
                        const sourceCode = context.sourceCode;
                        const tokenAfter = sourceCode.getTokenAfter(property);
                        if (tokenAfter && tokenAfter.value === ',') {
                           return fixer.removeRange([property.range[0], tokenAfter.range[1]]);
                        }
                        return fixer.remove(property);
                      },
                    });
                  }
                }

                // Check run, setup, cleanup
                if (['run', 'setup', 'cleanup'].includes(name)) {
                  let isEmpty = false;

                  // Method definition: run() {}
                  if (
                    property.value.type === AST_NODE_TYPES.FunctionExpression || 
                    property.value.type === AST_NODE_TYPES.ArrowFunctionExpression
                  ) {
                     if (
                        property.value.body.type === AST_NODE_TYPES.BlockStatement &&
                        property.value.body.body.length === 0
                     ) {
                        isEmpty = true;
                     }
                  }

                  if (isEmpty) {
                    context.report({
                      node: property,
                      messageId: 'emptyProperty',
                      data: { name },
                      fix(fixer) {
                         const sourceCode = context.sourceCode;
                         const tokenAfter = sourceCode.getTokenAfter(property);
                         if (tokenAfter && tokenAfter.value === ',') {
                            return fixer.removeRange([property.range[0], tokenAfter.range[1]]);
                         }
                         return fixer.remove(property);
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

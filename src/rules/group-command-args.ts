import { createRule } from '../utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

type ArgumentCategory = 'positional' | 'required' | 'optional';

function getProperty(
  node: TSESTree.ObjectExpression,
  key: string
): TSESTree.Property | undefined {
  return node.properties.find(
    (p): p is TSESTree.Property =>
      p.type === AST_NODE_TYPES.Property &&
      p.key.type === AST_NODE_TYPES.Identifier &&
      p.key.name === key
  );
}

function getArgumentCategory(node: TSESTree.Property): ArgumentCategory {
  if (
    node.value.type !== AST_NODE_TYPES.ObjectExpression ||
    node.computed
  ) {
    return 'optional';
  }

  const typeProp = getProperty(node.value, 'type');
  if (
    typeProp &&
    typeProp.value.type === AST_NODE_TYPES.Literal &&
    typeProp.value.value === 'positional'
  ) {
    return 'positional';
  }

  const requiredProp = getProperty(node.value, 'required');
  if (
    requiredProp &&
    requiredProp.value.type === AST_NODE_TYPES.Literal &&
    requiredProp.value.value === true
  ) {
    return 'required';
  }

  return 'optional';
}

export const groupCommandArgs = createRule({
  name: 'group-command-args',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce a specific grouping order for command arguments: positional, then required, then optional.',
    },
    messages: {
      incorrectOrder:
        'Arguments should be grouped in the following order: positional, required, optional.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type !== AST_NODE_TYPES.Identifier ||
          node.callee.name !== 'defineCommand' ||
          node.arguments.length === 0
        ) {
          return;
        }

        const commandObject = node.arguments[0];
        if (commandObject.type !== AST_NODE_TYPES.ObjectExpression) {
          return;
        }

        const argsProperty = getProperty(commandObject, 'args');
        if (
          !argsProperty ||
          argsProperty.value.type !== AST_NODE_TYPES.ObjectExpression
        ) {
          return;
        }

        const args = argsProperty.value.properties.filter(
          (p): p is TSESTree.Property => p.type === AST_NODE_TYPES.Property
        );

        if (args.length < 2) {
          return;
        }

        const categoryOrder: Record<ArgumentCategory, number> = {
          positional: 0,
          required: 1,
          optional: 2,
        };

        let maxCategory = 0;
        for (const arg of args) {
          const category = getArgumentCategory(arg);
          const categoryValue = categoryOrder[category];

          if (categoryValue < maxCategory) {
            context.report({
              node: argsProperty,
              messageId: 'incorrectOrder',
            });
            return;
          }
          maxCategory = categoryValue;
        }
      },
    };
  },
});

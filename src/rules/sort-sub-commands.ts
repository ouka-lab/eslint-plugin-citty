import { createRule } from '../utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

function getKey(node: TSESTree.Property) {
  if (node.key.type === AST_NODE_TYPES.Identifier) {
    return node.key.name;
  }
  if (node.key.type === AST_NODE_TYPES.Literal && typeof node.key.value === 'string') {
    return node.key.value;
  }
  return null;
}

export const sortSubCommands = createRule({
  name: 'sort-sub-commands',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce subCommands to be sorted alphabetically and prefer command references over inline definitions.',
    },
    fixable: 'code',
    messages: {
      notSorted: 'subCommands should be sorted alphabetically.',
      preferReference: 'Prefer using a command reference over an inline definition in subCommands.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.sourceCode;

    return {
      CallExpression(node) {
        if (
          node.callee.type !== AST_NODE_TYPES.Identifier ||
          node.callee.name !== 'defineCommand' ||
          node.arguments.length === 0
        ) {
          return;
        }

        const arg = node.arguments[0];
        if (arg.type !== AST_NODE_TYPES.ObjectExpression) {
          return;
        }

        const subCommandsProperty = arg.properties.find(
          (property): property is TSESTree.Property & { value: TSESTree.ObjectExpression } =>
            property.type === AST_NODE_TYPES.Property &&
            property.key.type === AST_NODE_TYPES.Identifier &&
            property.key.name === 'subCommands' &&
            property.value.type === AST_NODE_TYPES.ObjectExpression
        );

        if (!subCommandsProperty) {
          return;
        }
        
        let hasInlineDefinition = false;
        for (const prop of subCommandsProperty.value.properties) {
          if (prop.type === AST_NODE_TYPES.Property && prop.value.type === AST_NODE_TYPES.CallExpression && prop.value.callee.type === AST_NODE_TYPES.Identifier && prop.value.callee.name === 'defineCommand') {
            context.report({
              node: prop.value,
              messageId: 'preferReference',
            });
            hasInlineDefinition = true;
          }
        }
        
        if (hasInlineDefinition || subCommandsProperty.value.properties.length < 2) {
          return;
        }


        const properties = subCommandsProperty.value.properties;
        const keys = properties.map((p) => (p.type === AST_NODE_TYPES.Property ? getKey(p) : null)).filter(Boolean) as string[];

        const sortedKeys = [...keys].sort();

        for (let i = 0; i < keys.length; i++) {
          if (keys[i] !== sortedKeys[i]) {
            context.report({
              node: subCommandsProperty.value,
              messageId: 'notSorted',
              fix(fixer) {
                const sortedProperties = [...properties].sort((a, b) => {
                  if (a.type !== AST_NODE_TYPES.Property || b.type !== AST_NODE_TYPES.Property) return 0;
                  const keyA = getKey(a) ?? '';
                  const keyB = getKey(b) ?? '';
                  return keyA.localeCompare(keyB);
                });
                
                const range: [number, number] = [
                  properties[0].range[0],
                  properties[properties.length - 1].range[1],
                ];

                const newText = sortedProperties
                  .map((p) => sourceCode.getText(p))
                  .join(',\n');
                
                return fixer.replaceTextRange(range, newText);
              },
            });
            return;
          }
        }
      },
    };
  },
});
import { createRule } from '../utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

export const valueHintCase = createRule({
  name: 'value-hint-case',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce letter case for valueHint',
    },
    messages: {
      incorrectCase: 'valueHint "{{value}}" must be in {{caseType}} case.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          case: {
            enum: ['upper', 'lower', 'camel', 'kebab', 'pascal', 'snake'],
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [
    {
      case: 'upper',
    },
  ],
  create(context, [options]) {
    const caseType = options?.case || 'upper';

    const checkCase = (value: string, type: string): boolean => {
      switch (type) {
        case 'upper':
          return value === value.toUpperCase() && value !== value.toLowerCase(); // Ensure it has some letters
        case 'lower':
          return value === value.toLowerCase() && value !== value.toUpperCase();
        case 'camel':
          return /^[a-z][a-zA-Z0-9]*$/.test(value);
        case 'kebab':
          return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value);
        case 'pascal':
          return /^[A-Z][a-zA-Z0-9]*$/.test(value);
        case 'snake':
            return /^[a-z0-9]+(_[a-z0-9]+)*$/.test(value);
        default:
          return true;
      }
    };
    
    // Helper to allow numbers/symbols if pure casing check fails (e.g. for "upper", "FOO_BAR" is fine, but check above is strict)
    // Actually, simple Upper/Lower check is usually sufficient for simple hints.
    // Let's refine valid logic.
    const isValid = (value: string, type: string): boolean => {
        if (!value) return true;
        
        switch (type) {
            case 'upper':
                return value === value.toUpperCase();
            case 'lower':
                return value === value.toLowerCase();
            case 'camel':
                return /^[a-z][a-zA-Z0-9]*$/.test(value);
            case 'kebab':
                 return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value);
            case 'pascal':
                return /^[A-Z][a-zA-Z0-9]*$/.test(value);
            case 'snake':
                return /^[a-z0-9]+(_[a-z0-9]+)*$/.test(value);
            default:
                return true;
        }
    }


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

                  if (
                    valueHintProp &&
                    valueHintProp.type === AST_NODE_TYPES.Property &&
                    valueHintProp.value.type === AST_NODE_TYPES.Literal &&
                    typeof valueHintProp.value.value === 'string'
                  ) {
                    const value = valueHintProp.value.value;
                    if (!isValid(value, caseType)) {
                         context.report({
                            node: valueHintProp.value,
                            messageId: 'incorrectCase',
                            data: {
                                value,
                                caseType,
                            }
                         })
                    }
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

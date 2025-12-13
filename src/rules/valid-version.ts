import { createRule } from '../utils';

const DEFAULT_VERSION_REGEX = '^v?\\d+\\.\\d+\\.\\d+(?:-[\\w\\.]+)?(?:\\+[\\w\\.]+)?$';

export const validVersion = createRule({
  name: 'valid-version',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce version format in citty commands',
    },
    messages: {
      invalidFormat: 'Version "{{version}}" does not match the required format: {{pattern}}',
    },
    schema: [
      {
        type: 'object',
        properties: {
          pattern: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [
    {
      pattern: DEFAULT_VERSION_REGEX,
    },
  ],
  create(context, [options]) {
    const pattern = new RegExp(options?.pattern || DEFAULT_VERSION_REGEX);

    return {
      CallExpression(node) {
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'defineCommand' &&
          node.arguments.length > 0
        ) {
          const arg = node.arguments[0];
          if (arg.type === 'ObjectExpression') {
            const metaProperty = arg.properties.find(
              (property) =>
                property.type === 'Property' &&
                property.key.type === 'Identifier' &&
                property.key.name === 'meta'
            );

            if (
              metaProperty &&
              metaProperty.value.type === 'ObjectExpression'
            ) {
              const versionProperty = metaProperty.value.properties.find(
                (property) =>
                  property.type === 'Property' &&
                  property.key.type === 'Identifier' &&
                  property.key.name === 'version'
              );

              if (
                versionProperty &&
                versionProperty.value.type === 'Literal' &&
                typeof versionProperty.value.value === 'string'
              ) {
                const version = versionProperty.value.value;
                if (!pattern.test(version)) {
                  context.report({
                    node: versionProperty.value,
                    messageId: 'invalidFormat',
                    data: {
                      version,
                      pattern: options?.pattern || DEFAULT_VERSION_REGEX,
                    },
                  });
                }
              }
            }
          }
        }
      },
    };
  },
});

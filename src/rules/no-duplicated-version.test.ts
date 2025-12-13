import { RuleTester } from '@typescript-eslint/utils/ts-eslint';
import { it, describe } from 'vitest';
import { noDuplicatedVersion } from './no-duplicated-version';
import * as tseslintParser from '@typescript-eslint/parser';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslintParser,
  },
});

describe('no-duplicated-version', () => {
  ruleTester.run('no-duplicated-version', noDuplicatedVersion, {
    valid: [
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            meta: {
              version: "1.0.0",
            },
          });
        `,
      },
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            meta: {
              name: "my-cli",
            },
          });
          export const sub = defineCommand({
            meta: {
              description: "sub command",
            },
          });
        `,
      },
      {
          code: `
            import { defineCommand } from "citty";
            export const main = defineCommand({
              meta: {
                version: "1.0.0",
              },
            });
            export const sub = defineCommand({
              meta: {
                description: "sub command",
              },
            });
          `,
        },
    ],
    invalid: [
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            meta: {
              version: "1.0.0",
            },
          });
          export const sub = defineCommand({
            meta: {
              version: "1.0.1",
            },
          });
        `,
        errors: [{ messageId: 'duplicate' }],
      },
    ],
  });
});

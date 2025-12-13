import { RuleTester } from '@typescript-eslint/utils/ts-eslint';
import { it, describe } from 'vitest';
import { aliasShouldBeShort } from './alias-should-be-short';
import * as tseslintParser from '@typescript-eslint/parser';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslintParser,
  },
});

describe('alias-should-be-short', () => {
  ruleTester.run('alias-should-be-short', aliasShouldBeShort, {
    valid: [
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              force: {
                alias: "f",
              },
            },
          });
        `,
      },
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              output: {
                alias: ["o", "out"],
              },
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
            args: {
              force: {
                alias: "force",
              },
            },
          });
        `,
        errors: [{ messageId: 'aliasNotShort', data: { alias: "force", name: "force" } }],
      },
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              force: {
                alias: "force-mode",
              },
            },
          });
        `,
        errors: [{ messageId: 'aliasNotShort', data: { alias: "force-mode", name: "force" } }],
      },
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              output: {
                alias: ["o", "output"],
              },
            },
          });
        `,
        errors: [{ messageId: 'aliasNotShort', data: { alias: "output", name: "output" } }],
      },
    ],
  });
});

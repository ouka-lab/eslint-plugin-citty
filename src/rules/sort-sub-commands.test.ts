import { RuleTester } from '@typescript-eslint/utils/ts-eslint';
import { it, describe } from 'vitest';
import { sortSubCommands } from './sort-sub-commands';
import * as tseslintParser from '@typescript-eslint/parser';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslintParser,
  },
});

describe('sort-sub-commands', () => {
  ruleTester.run('sort-sub-commands', sortSubCommands, {
    valid: [
      {
        code: `
          import { defineCommand } from "citty";
          const a = defineCommand({});
          const b = defineCommand({});
          const c = defineCommand({});
          export const main = defineCommand({
            subCommands: {
              a,
              b,
              c,
            },
          });
        `,
      },
    ],
    invalid: [
      {
        code: `
          import { defineCommand } from "citty";
          const a = defineCommand({});
          const b = defineCommand({});
          export const main = defineCommand({
            subCommands: {
              b,
              a,
            },
          });
        `,
        output: `
          import { defineCommand } from "citty";
          const a = defineCommand({});
          const b = defineCommand({});
          export const main = defineCommand({
            subCommands: {
              a,
b,
            },
          });
        `,
        errors: [{ messageId: 'notSorted' }],
      },
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            subCommands: {
              b: defineCommand({}),
              a: defineCommand({}),
            },
          });
        `,
        // No autofix for inline definitions
        output: null,
        errors: [
          { messageId: 'preferReference' },
          { messageId: 'preferReference' },
        ],
      },
    ],
  });
});
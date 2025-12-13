import { RuleTester } from '@typescript-eslint/utils/ts-eslint';
import { it, describe } from 'vitest';
import { mustHaveRunOrSubCommands } from './must-have-run-or-sub-commands';
import * as tseslintParser from '@typescript-eslint/parser';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslintParser,
  },
});

describe('must-have-run-or-sub-commands', () => {
  ruleTester.run('must-have-run-or-sub-commands', mustHaveRunOrSubCommands, {
    valid: [
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            run() {
              console.log("hello");
            },
          });
        `,
      },
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            subCommands: {
              sub: import("./sub"),
            },
          });
        `,
      },
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            run() {
              console.log("hello");
            },
            subCommands: {
              sub: import("./sub"),
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
              name: "main",
            },
          });
        `,
        errors: [{ messageId: 'missingRunOrSubCommands' }],
      },
    ],
  });
});

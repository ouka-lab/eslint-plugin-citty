import { RuleTester } from '@typescript-eslint/utils/ts-eslint';
import { it, describe } from 'vitest';
import { enumMustHaveOptions } from './enum-must-have-options';
import * as tseslintParser from '@typescript-eslint/parser';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslintParser,
  },
});

describe('enum-must-have-options', () => {
  ruleTester.run('enum-must-have-options', enumMustHaveOptions, {
    valid: [
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              choice: {
                type: "enum",
                options: ["a", "b"],
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
              name: {
                type: "string",
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
              choice: {
                type: "enum",
              },
            },
          });
        `,
        errors: [{ messageId: 'missingOptions' }],
      },
    ],
  });
});

import { RuleTester } from '@typescript-eslint/utils/ts-eslint';
import { it, describe } from 'vitest';
import { recommendMeta } from './recommend-meta';
import * as tseslintParser from '@typescript-eslint/parser';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslintParser,
  },
});

describe('recommend-meta', () => {
  ruleTester.run('recommend-meta', recommendMeta, {
    valid: [
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            meta: {
              name: "main",
              description: "Main command",
            },
            run() {
              console.log("hello");
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
            run() {
              console.log("hello");
            },
          });
        `,
        errors: [{ messageId: 'missingMeta' }],
      },
    ],
  });
});

import { RuleTester } from '@typescript-eslint/utils/ts-eslint';
import { it, describe } from 'vitest';
import { valueHintCase } from './value-hint-case';
import * as tseslintParser from '@typescript-eslint/parser';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslintParser,
  },
});

describe('value-hint-case', () => {
  ruleTester.run('value-hint-case', valueHintCase, {
    valid: [
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              name: {
                type: String,
                valueHint: "NAME",
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
              path: {
                type: String,
                valueHint: "FILE_PATH",
              },
            },
          });
        `,
      },
      // Custom case: lower
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              name: {
                type: String,
                valueHint: "name",
              },
            },
          });
        `,
        options: [{ case: 'lower' }],
      },
      // Custom case: camel
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              userId: {
                type: String,
                valueHint: "userId",
              },
            },
          });
        `,
        options: [{ case: 'camel' }],
      },
    ],
    invalid: [
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              name: {
                type: String,
                valueHint: "name",
              },
            },
          });
        `,
        errors: [{ messageId: 'incorrectCase', data: { value: "name", caseType: "upper" } }],
      },
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              path: {
                type: String,
                valueHint: "FilePath",
              },
            },
          });
        `,
        errors: [{ messageId: 'incorrectCase', data: { value: "FilePath", caseType: "upper" } }],
      },
      // Custom case: lower invalid
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              name: {
                type: String,
                valueHint: "NAME",
              },
            },
          });
        `,
        options: [{ case: 'lower' }],
        errors: [{ messageId: 'incorrectCase', data: { value: "NAME", caseType: "lower" } }],
      },
    ],
  });
});

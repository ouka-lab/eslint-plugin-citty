import { RuleTester } from '@typescript-eslint/utils/ts-eslint';
import { it, describe } from 'vitest';
import { noMeaninglessValueHint } from './no-meaningless-value-hint';
import * as tseslintParser from '@typescript-eslint/parser';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslintParser,
  },
});

describe('no-meaningless-value-hint', () => {
  ruleTester.run('no-meaningless-value-hint', noMeaninglessValueHint, {
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
              force: {
                type: Boolean,
                description: "Force operation",
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
              choice: {
                type: String,
                enum: ["a", "b"],
                description: "Choose one",
              },
            },
          });
        `,
      },
      // valueHint without type or enum (edge case, but technically valid for this rule's logic)
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              something: {
                valueHint: "hint",
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
              verbose: {
                type: Boolean,
                valueHint: "level",
              },
            },
          });
        `,
        errors: [{ messageId: 'meaninglessBoolean' }],
      },
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              verbose: {
                type: "boolean",
                valueHint: "level",
              },
            },
          });
        `,
        errors: [{ messageId: 'meaninglessBoolean' }],
      },
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              format: {
                type: String,
                enum: ["json", "yaml"],
                valueHint: "format",
              },
            },
          });
        `,
        errors: [{ messageId: 'meaninglessEnum' }],
      },
    ],
  });
});

import { RuleTester } from '@typescript-eslint/utils/ts-eslint';
import { it, describe } from 'vitest';
import { noAliasOnPositional } from './no-alias-on-positional';
import * as tseslintParser from '@typescript-eslint/parser';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslintParser,
  },
});

describe('no-alias-on-positional', () => {
  ruleTester.run('no-alias-on-positional', noAliasOnPositional, {
    valid: [
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              input: {
                type: "positional",
                description: "Input file",
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
              verbose: {
                type: "boolean",
                alias: "v",
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
                alias: "n",
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
                type: "string",
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
              input: {
                type: "positional",
                alias: "i",
                description: "Input file",
              },
            },
          });
        `,
        errors: [{ messageId: 'noAlias' }],
      },
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              input: {
                type: "positional",
                alias: ["i", "in"],
              },
            },
          });
        `,
        errors: [{ messageId: 'noAlias' }],
      },
    ],
  });
});

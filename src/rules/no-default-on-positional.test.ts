import { RuleTester } from '@typescript-eslint/utils/ts-eslint';
import { it, describe } from 'vitest';
import { noDefaultOnPositional } from './no-default-on-positional';
import * as tseslintParser from '@typescript-eslint/parser';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslintParser,
  },
});

describe('no-default-on-positional', () => {
  ruleTester.run('no-default-on-positional', noDefaultOnPositional, {
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
                default: false,
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
                default: "default.txt",
                description: "Input file",
              },
            },
          });
        `,
        output: `
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
        errors: [{ messageId: 'meaninglessDefault' }],
      },
    ],
  });
});

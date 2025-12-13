import { RuleTester } from '@typescript-eslint/utils/ts-eslint';
import { it, describe } from 'vitest';
import { noEmptyCommandProperties } from './no-empty-command-properties';
import * as tseslintParser from '@typescript-eslint/parser';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslintParser,
  },
});

describe('no-empty-command-properties', () => {
  ruleTester.run('no-empty-command-properties', noEmptyCommandProperties, {
    valid: [
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            run() {
              console.log("hello");
            },
            setup() {
              console.log("setup");
            },
            cleanup() {
              console.log("cleanup");
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
            run() {},
            setup: () => {},
            cleanup() {},
            subCommands: {},
          });
        `,
        output: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            
            
            
            
          });
        `,
        errors: [
          { messageId: 'emptyProperty', data: { name: 'run' } },
          { messageId: 'emptyProperty', data: { name: 'setup' } },
          { messageId: 'emptyProperty', data: { name: 'cleanup' } },
          { messageId: 'emptyProperty', data: { name: 'subCommands' } },
        ],
      },
      // Test comma removal
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            meta: {},
            run() {},
            args: {},
          });
        `,
        output: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            meta: {},
            
            args: {},
          });
        `,
        errors: [
          { messageId: 'emptyProperty', data: { name: 'run' } },
        ],
      },
    ],
  });
});

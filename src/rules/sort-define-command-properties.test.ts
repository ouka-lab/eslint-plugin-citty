import { RuleTester } from '@typescript-eslint/utils/ts-eslint';
import { it, describe } from 'vitest';
import { sortDefineCommandProperties } from './sort-define-command-properties';
import * as tseslintParser from '@typescript-eslint/parser';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslintParser,
  },
});

describe('sort-define-command-properties', () => {
  ruleTester.run(
    'sort-define-command-properties',
    sortDefineCommandProperties,
    {
      valid: [
        {
          code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            meta: {},
            args: {},
            setup() {},
            run() {},
            cleanup() {},
            subCommands: {},
          });
        `,
        },
        {
          // partial, but in order
          code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            meta: {},
            run() {},
          });
        `,
        },
        {
          // with unknown properties
          code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            meta: {},
            unknown: true,
            run() {},
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
            meta: {},
          });
        `,
          errors: [{ messageId: 'incorrectOrder' }],
        },
        {
          code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            subCommands: {},
            run() {},
            args: {},
            meta: {},
            cleanup() {},
            setup() {},
          });
        `,
          errors: [{ messageId: 'incorrectOrder' }],
        },
        {
          // with unknown properties and trailing comma
          code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            run() {},
            unknown: 1,
            meta: {},
          });
        `,
          errors: [{ messageId: 'incorrectOrder' }],
        },
      ],
    }
  );
});

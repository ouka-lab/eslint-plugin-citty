import { RuleTester } from '@typescript-eslint/utils/ts-eslint';
import { it, describe } from 'vitest';
import { groupCommandArgs } from './group-command-args';
import * as tseslintParser from '@typescript-eslint/parser';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslintParser,
  },
});

describe('group-command-args', () => {
  ruleTester.run('group-command-args', groupCommandArgs, {
    valid: [
      // Correct order: positional, required, optional
      {
        code: `
        import { defineCommand } from "citty";
        export const main = defineCommand({
          args: {
            pos: { type: "positional" },
            req: { required: true },
            opt: { required: false }
          }
        });
        `,
      },
      // Only positionals
      {
        code: `
        import { defineCommand } from "citty";
        export const main = defineCommand({
          args: {
            pos1: { type: "positional" },
            pos2: { type: "positional" }
          }
        });
        `,
      },
      // Only required and optional
      {
        code: `
        import { defineCommand } from "citty";
        export const main = defineCommand({
          args: {
            req: { required: true },
            opt: {}
          }
        });
        `,
      },
      // Empty args
      {
        code: `
        import { defineCommand } from "citty";
        export const main = defineCommand({ args: {} });
        `,
      },
    ],
    invalid: [
      // Optional before required
      {
        code: `
        import { defineCommand } from "citty";
        export const main = defineCommand({
          args: {
            opt: { required: false },
            req: { required: true }
          }
        });
        `,
        errors: [{ messageId: 'incorrectOrder' }],
      },
      // Required before positional
      {
        code: `
        import { defineCommand } from "citty";
        export const main = defineCommand({
          args: {
            req: { required: true },
            pos: { type: "positional" }
          }
        });
        `,
        errors: [{ messageId: 'incorrectOrder' }],
      },
      // Mixed up
      {
        code: `
        import { defineCommand } from "citty";
        export const main = defineCommand({
          args: {
            opt1: {},
            req1: { required: true },
            pos1: { type: "positional" },
            opt2: {},
            req2: { required: true }
          }
        });
        `,
        errors: [{ messageId: 'incorrectOrder' }],
      },
      // More complex mixed up case with multiple positionals and optionals
      {
        code: `
        import { defineCommand } from "citty";
        export const main = defineCommand({
          args: {
            req1: { required: true },
            opt1: { required: false },
            pos1: { type: "positional" },
            req2: { required: true },
            opt2: {},
            pos2: { type: "positional" },
            opt3: { required: false },
            req3: { required: true },
            opt4: {}
          }
        });
        `,
        errors: [{ messageId: 'incorrectOrder' }],
      },
    ],
  });
});

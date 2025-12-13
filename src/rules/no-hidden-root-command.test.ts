import { RuleTester } from '@typescript-eslint/utils/ts-eslint';
import { it, describe } from 'vitest';
import { noHiddenRootCommand } from './no-hidden-root-command';
import * as tseslintParser from '@typescript-eslint/parser';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslintParser,
  },
});

describe('no-hidden-root-command', () => {
  ruleTester.run('no-hidden-root-command', noHiddenRootCommand, {
    valid: [
      // Sub command (exported with random name)
      {
        code: `
          import { defineCommand } from "citty";
          export const sub = defineCommand({
            meta: {
              hidden: true,
            },
          });
        `,
      },
      // Root command without hidden
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            meta: {
              name: "main",
            },
          });
        `,
      },
      // Default export without hidden
      {
        code: `
          import { defineCommand } from "citty";
          export default defineCommand({
            meta: {
              version: "1.0.0",
            },
          });
        `,
      },
      // Local variable (not exported, context unknown)
      {
        code: `
          import { defineCommand } from "citty";
          const cmd = defineCommand({
            meta: {
              hidden: true,
            },
          });
        `,
      },
    ],
    invalid: [
      // Export default with hidden
      {
        code: `
          import { defineCommand } from "citty";
          export default defineCommand({
            meta: {
              hidden: true,
            },
          });
        `,
        errors: [{ messageId: 'meaninglessHidden' }],
      },
      // Export named 'main' with hidden
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            meta: {
              hidden: true,
            },
          });
        `,
        errors: [{ messageId: 'meaninglessHidden' }],
      },
      // Export named 'root' with hidden
      {
        code: `
          import { defineCommand } from "citty";
          export const root = defineCommand({
            meta: {
              hidden: true,
            },
          });
        `,
        errors: [{ messageId: 'meaninglessHidden' }],
      },
    ],
  });
});

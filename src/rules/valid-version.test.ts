import { RuleTester } from '@typescript-eslint/utils/ts-eslint';
import { it, describe } from 'vitest';
import { validVersion } from './valid-version';
import * as tseslintParser from '@typescript-eslint/parser';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslintParser,
  },
});

describe('valid-version', () => {
  ruleTester.run('valid-version', validVersion, {
    valid: [
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            meta: {
              version: "1.0.0",
            },
          });
        `,
      },
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            meta: {
              version: "v1.2.3",
            },
          });
        `,
      },
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            meta: {
              version: "1.0.0-beta.1",
            },
          });
        `,
      },
      // Custom pattern
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            meta: {
              version: "2023.12.01",
            },
          });
        `,
        options: [{ pattern: '^\\d{4}\\.\\d{2}\\.\\d{2}$' }],
      },
    ],
    invalid: [
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            meta: {
              version: "invalid-version",
            },
          });
        `,
        errors: [{ messageId: 'invalidFormat' }],
      },
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            meta: {
              version: "1.0",
            },
          });
        `,
        errors: [{ messageId: 'invalidFormat' }],
      },
      // Custom pattern invalid
      {
        code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            meta: {
              version: "1.0.0",
            },
          });
        `,
        options: [{ pattern: '^\\d{4}\\.\\d{2}\\.\\d{2}$' }],
        errors: [{ messageId: 'invalidFormat' }],
      },
    ],
  });
});

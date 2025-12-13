import { RuleTester } from '@typescript-eslint/utils/ts-eslint';
import { it, describe } from 'vitest';
import { recommendNameAndDescriptionInArgs } from './recommend-name-and-description-in-args';
import * as tseslintParser from '@typescript-eslint/parser';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslintParser,
  },
});

describe('recommend-name-and-description-in-args', () => {
  ruleTester.run(
    'recommend-name-and-description-in-args',
    recommendNameAndDescriptionInArgs,
    {
      valid: [
        {
          code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              foo: {
                name: "foo",
                description: "Foo argument",
              },
            },
            run() {},
          });
        `,
          options: [{ check: ["name", "description"] }],
        },
        {
          code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              foo: {
                name: "foo",
              },
            },
            run() {},
          });
        `,
          options: [{ check: ["name"] }],
        },
        {
          code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              foo: {
                description: "Foo argument",
              },
            },
            run() {},
          });
        `,
          options: [{ check: ["description"] }],
        },
      ],
      invalid: [
        {
          code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              foo: {},
            },
            run() {},
          });
        `,
          options: [{ check: ["name", "description"] }],
          errors: [{ messageId: 'missingName' }, { messageId: 'missingDescription' }],
        },
        {
          code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              foo: {
                name: "foo",
              },
            },
            run() {},
          });
        `,
          options: [{ check: ["name", "description"] }],
          errors: [{ messageId: 'missingDescription' }],
        },
        {
          code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              foo: {
                description: "Foo argument",
              },
            },
            run() {},
          });
        `,
          options: [{ check: ["name", "description"] }],
          errors: [{ messageId: 'missingName' }],
        },
        {
          code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              foo: {},
            },
            run() {},
          });
        `,
          options: [{ check: ["name"] }],
          errors: [{ messageId: 'missingName' }],
        },
        {
          code: `
          import { defineCommand } from "citty";
          export const main = defineCommand({
            args: {
              foo: {},
            },
            run() {},
          });
        `,
          options: [{ check: ["description"] }],
          errors: [{ messageId: 'missingDescription' }],
        },
      ],
    }
  );
});

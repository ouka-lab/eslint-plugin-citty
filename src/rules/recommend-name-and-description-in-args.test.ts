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
          errors: [{ messageId: 'missingName' }],
        },
      ],
    }
  );
});

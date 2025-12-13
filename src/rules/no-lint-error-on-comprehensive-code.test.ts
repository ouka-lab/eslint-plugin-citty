import { ESLint } from 'eslint';
import { it, describe, expect } from 'vitest';
import * as tseslintParser from '@typescript-eslint/parser';
import cittyPlugin from '../index';

const cittyCodeWithoutLintError = `
import { defineCommand, runMain } from "citty";

const echoNestedCommand = defineCommand({
  meta: {
    name: "echo",
    description: "Echos back the provided text.",
  },
  args: {
    text: {
      type: "positional",
      name: "text",
      description: "The text to echo.",
      required: true,
    },
  },
  run({ args }) {
    console.log(args.text);
  },
});

const nestedCommand = defineCommand({
  meta: {
    name: "nested",
    description: "A command with its own subcommands.",
  },
  subCommands: {
    echo: echoNestedCommand,
  },
});

const argsDemoCommand = defineCommand({
  meta: {
    name: "args-demo",
    description: "Demonstrates all supported argument types and options.",
  },
  args: {
    target: {
      type: "positional",
      name: "target",
      description: "A required target for the command.",
      required: true,
      valueHint: "FILE|DIRECTORY",
    },
    level: {
      type: "enum",
      name: "level",
      description: "Set the logging level.",
      options: ["info", "warn", "error"],
      required: true,
    },
    username: {
      type: "string",
      name: "username",
      description: "Username for authentication.",
      alias: "u",
    },
    greeting: {
      type: "string",
      name: "greeting",
      description: "A custom greeting.",
      default: "Hello",
    },
    force: {
      type: "boolean",
      name: "force",
      description: "Force the operation.",
      alias: "f",
    },
    cache: {
      type: "boolean",
      name: "cache",
      description: "Enable caching.",
      negativeDescription: "Disable caching.",
      default: true,
    },
    retries: {
      type: "number",
      name: "retries",
      description: "Number of retries.",
      default: 3,
      valueHint: "COUNT",
    },
    output: {
      type: "string",
      name: "output",
      description: "Specify output file.",
      alias: ["o", "out"],
    },
  },
  run({ args }) {
    console.log("--- Args Demo ---");
    console.log("Parsed Arguments:", args);
    console.log("-----------------");
  },
});

const asyncDemoCommand = defineCommand({
  meta: {
    name: "async-demo",
    description: "Demonstrates async hooks (setup, run, cleanup).",
  },
  setup: async () => {
    console.log("[Async] Setting up resources...");
    await new Promise((resolve) => setTimeout(resolve, 200));
    console.log("[Async] Setup complete.");
    return { startTime: Date.now() };
  },
  run: async ({ data }) => {
    console.log("[Async] Running main task...");
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("[Async] Task started at: " + new Date(data.startTime).toLocaleTimeString());
  },
  cleanup: async ({ startTime }) => {
    console.log("[Async] Cleaning up resources...");
    await new Promise((resolve) => setTimeout(resolve, 200));
    const duration = (Date.now() - startTime) / 1000;
    console.log(
      "[Async] Cleanup complete. Total duration: " + duration.toFixed(2) + "s",
    );
  },
});

const hiddenCommand = defineCommand({
  meta: {
    name: "hidden-cmd",
    description: "This is a secret command.",
    hidden: true,
  },
  run() {
    console.log("✨ You found the hidden command! ✨");
  },
});

const main = defineCommand({
  meta: () => ({
    name: "citty-example",
    version: "1.0.0",
    description: "A comprehensive CLI example for citty.",
  }),

  args: async () => ({
    verbose: {
      type: "boolean",
      name: "verbose",
      description: "Enable verbose output.",
      alias: "v",
    },
    "no-color": {
      type: "boolean",
      name: "no-color",
      description: "Disable color output.",
    },
  }),

  run({ args }) {
    console.log("Welcome to the citty comprehensive example!");
    if (args.verbose) {
      console.log("Verbose mode is enabled.");
    }
    if (args["no-color"]) {
      console.log("Color output is disabled.");
    }
  },

  subCommands: {
    "args-demo": argsDemoCommand,
    "async-demo": asyncDemoCommand,
    "hidden-cmd": hiddenCommand,
    nested: nestedCommand,
  },
});

runMain(main);
`;

describe('no-lint-error-on-comprehensive-code', () => {
  it('should not have any lint errors', async () => {
    const eslint = new ESLint({
      baseConfig: [
        {
          languageOptions: {
            parser: tseslintParser,
            globals: {
              console: 'readonly',
              setTimeout: 'readonly',
              Promise: 'readonly',
              Date: 'readonly',
              defineCommand: 'readonly',
              runMain: 'readonly',
            },
          },
          plugins: {
            citty: cittyPlugin,
          },
          rules: {
            'citty/no-duplicated-version': 'error',
            'citty/valid-version': 'error',
            'citty/no-meaningless-value-hint': 'error',
            'citty/value-hint-case': 'error',
            'citty/no-hidden-root-command': 'error',
            'citty/no-alias-on-positional': 'error',
            'citty/enum-must-have-options': 'error',
            'citty/must-have-run-or-sub-commands': 'error',
            'citty/recommend-meta': 'error',
            'citty/no-empty-command-properties': 'error',
            'citty/no-default-on-positional': 'error',
            'citty/alias-should-be-short': 'error',
            'citty/recommend-name-and-description-in-args': ['error', { check: ['name', 'description'] }],
            'citty/sort-sub-commands': 'error',
            'citty/sort-define-command-properties': 'error',
            'citty/group-command-args': 'error',
          },
        },
      ],
    });

    const results = await eslint.lintText(cittyCodeWithoutLintError);
    const errorMessages = results.flatMap(result => result.messages);

    expect(errorMessages).toEqual([]);
  });
});
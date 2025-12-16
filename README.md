# eslint-plugin-citty

🌆 ESLint plugin for [citty](https://github.com/unjs/citty) and all citty lovers

## Installation

```bash
npm install -D eslint-plugin-citty
```

## Usage

Sample `eslint.config.mjs`

```javascript
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import citty from "eslint-plugin-citty";

export default [
    {
        plugins: {
            citty: citty,
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...citty.configs.recommended,
    {
        files: ["**/*.{ts,tsx,cts,mts}"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                project: "./tsconfig.json",
            },
            globals: globals.node,
        },
    },
];
```

## Rules

| Rule                                                               | ⚠️ warn   | 🚨 error  | 🔧 fix  |
| :----------------------------------------------------------------- | :--: | :--: | :--: |
| [alias-should-be-short](#alias-should-be-short)                    |  ✅  |      |      |
| [enum-must-have-options](#enum-must-have-options)                  |      |  ✅  |      |
| [group-command-args](#group-command-args)                          |  ✅  |      |      |
| [must-have-run-or-sub-commands](#must-have-run-or-sub-commands)    |      |  ✅  |      |
| [no-alias-on-positional](#no-alias-on-positional)                  |      |  ✅  |  ✅  |
| [no-default-on-positional](#no-default-on-positional)              |  ✅  |      |  ✅  |
| [no-duplicated-version](#no-duplicated-version)                    |      |  ✅  |      |
| [no-empty-command-properties](#no-empty-command-properties)        |  ✅  |      |  ✅  |
| [no-hidden-root-command](#no-hidden-root-command)                  |  ✅  |      |      |
| [no-meaningless-value-hint](#no-meaningless-value-hint)            |  ✅  |      |  ✅  |
| [recommend-meta](#recommend-meta)                                  |  ✅  |      |      |
| [recommend-name-and-description-in-args](#recommend-name-and-description-in-args) |  ✅  |      |      |
| [sort-define-command-properties](#sort-define-command-properties)  |  ✅  |      |      |
| [sort-sub-commands](#sort-sub-commands)                            |  ✅  |      |  ✅  |
| [valid-version](#valid-version)                                    |      |  ✅  |      |
| [value-hint-case](#value-hint-case)                                |      |  ✅  |      |

### no-duplicated-version

Disallow multiple version definitions in citty commands within the same file.

**Bad**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  meta: {
    version: "1.0.0",
  },
});

export const sub = defineCommand({
  meta: {
    version: "1.0.1", // Duplicate version definition in the same file
  },
});
```

**Good**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  meta: {
    version: "1.0.0",
  },
});

export const sub = defineCommand({
  meta: {
    description: "Sub command",
  },
});
```

### valid-version

Enforce version format in citty commands. Defaults to SemVer.

**Bad**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  meta: {
    version: "invalid-version",
  },
});
```

**Good**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  meta: {
    version: "1.0.0",
  },
});
```

#### Options

You can customize the version format using the `pattern` option.

**Config**

```json
{
  "rules": {
    "citty/valid-version": ["error", { "pattern": "^\\d{4}\\.\\d{2}\\.\\d{2}$" }]
  }
}
```

**Bad (Custom Pattern)**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  meta: {
    version: "1.0.0", // Does not match YYYY.MM.DD
  },
});
```

**Good (Custom Pattern)**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  meta: {
    version: "2023.12.01",
  },
});
```

### no-meaningless-value-hint

Disallow `valueHint` when it is meaningless (boolean type or enum specified).

**Bad**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  args: {
    verbose: {
      type: Boolean,
      valueHint: "level", // meaningless for boolean
    },
    format: {
      type: String,
      enum: ["json", "yaml"],
      valueHint: "format", // meaningless for enum
    },
  },
});
```

**Good**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  args: {
    name: {
      type: String,
      valueHint: "NAME",
    },
    verbose: {
      type: Boolean,
    },
  },
});
```

### value-hint-case

Enforce letter case for `valueHint`. Defaults to `upper` case (UPPER_CASE).

**Options**

- `case`: `upper` (default), `lower`, `camel`, `kebab`, `pascal`, `snake`

**Bad**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  args: {
    name: {
      type: String,
      valueHint: "name", // Should be upper case
    },
  },
});
```

**Good**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  args: {
    name: {
      type: String,
      valueHint: "NAME",
    },
  },
});
```

#### Custom Configuration

```json
{
  "rules": {
    "citty/value-hint-case": ["error", { "case": "camel" }]
  }
}
```

**Good (Camel Case Config)**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  args: {
    userId: {
      type: String,
      valueHint: "userId",
    },
  },
});
```

### no-hidden-root-command

Disallow `hidden` property in root commands.
This rule considers `export default defineCommand(...)` or `export const main = defineCommand(...)` as root commands.

**Bad**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  meta: {
    hidden: true, // Root command cannot be hidden
  },
});
```

**Good**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  meta: {
    name: "main",
  },
});

export const sub = defineCommand({
  meta: {
    hidden: true, // Sub command can be hidden
  },
});
```

### no-alias-on-positional

Disallow `alias` property on positional arguments.

**Bad**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  args: {
    input: {
      type: "positional",
      alias: "i", // Positional arguments cannot have aliases
    },
  },
});
```

**Good**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  args: {
    input: {
      type: "positional",
    },
    verbose: {
      type: "boolean",
      alias: "v",
    },
  },
});
```

### enum-must-have-options

Enforce `options` property when argument type is `enum`.

**Bad**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  args: {
    choice: {
      type: "enum",
      // options missing
    },
  },
});
```

**Good**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  args: {
    choice: {
      type: "enum",
      options: ["a", "b"],
    },
  },
});
```

### must-have-run-or-sub-commands

Enforce that a command has either `run` or `subCommands` defined.

**Bad**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  meta: {
    name: "main",
  },
  // missing run or subCommands
});
```

**Good**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  meta: {
    name: "main",
  },
  run() {
    console.log("Hello");
  },
});
```

### recommend-meta

Recommend that a command has `meta` property defined.

**Bad**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  run() {
    console.log("Hello");
  },
  // missing meta
});
```

**Good**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  meta: {
    name: "main",
    description: "My command",
  },
  run() {
    console.log("Hello");
  },
});
```

### no-empty-command-properties

Disallow empty implementations for `run`, `setup`, `cleanup`, and `subCommands`.
These properties should be removed if not used.

**Bad**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  run() {}, // Empty function
  subCommands: {}, // Empty object
});
```

**Good**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  run() {
    console.log("Running...");
  },
  // subCommands removed
});
```

### no-default-on-positional

Disallow `default` property on positional arguments.

**Bad**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  args: {
    input: {
      type: "positional",
      default: "default.txt", // Positional arguments cannot have default values
    },
  },
});
```

**Good**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  args: {
    input: {
      type: "positional",
    },
    verbose: {
      type: "boolean",
      default: false,
    },
  },
});
```

### alias-should-be-short

Warn when an alias is not shorter than the argument name itself.

**Bad**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  args: {
    force: {
      alias: "force", // Same length as argument name
    },
  },
});
```

**Good**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  args: {
    force: {
      alias: "f",
    },
  },
});
```

### recommend-name-and-description-in-args

Recommend that an arg has `name` and `description` properties defined.

#### Options

YouYou can customize which properties to check using the `check` option. By default, both `name` and `description` are checked.

- `check`: `array` (default: `["name", "description"]`)
  An array of strings indicating which properties to check for existence. Valid values are `"name"` and `"description"`.

**Config (Check only `name`)**

```json
{
  "rules": {
    "citty/recommend-name-and-description-in-args": ["warn", { "check": ["name"] }]
  }
}
```

**Bad (Checking only `name`)**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  args: {
    foo: {
      description: "Foo argument",
      // missing name
    },
  },
});
```

**Good (Checking only `name`)**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  args: {
    foo: {
      name: "foo",
      description: "Foo argument",
    },
  },
});
```

**Config (Check only `description`)**

```json
{
  "rules": {
    "citty/recommend-name-and-description-in-args": ["warn", { "check": ["description"] }]
  }
}
```

**Bad (Checking only `description`)**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  args: {
    foo: {
      name: "foo",
      // missing description
    },
  },
});
```

**Good (Checking only `description`)**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  args: {
    foo: {
      name: "foo",
      description: "Foo argument",
    },
  },
});
```

**Bad (Default behavior - missing both)**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  args: {
    force: {
      // missing name and description
    },
  },
});
```

**Good (Default behavior - both present)**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  args: {
    force: {
      name: "force",
      description: "Force the command",
    },
  },
});
```

### sort-sub-commands

Enforce subCommands to be sorted alphabetically and prefer command references over inline definitions.

**Bad**

```ts
import { defineCommand } from "citty";

const b = defineCommand({});
const a = defineCommand({});

export const main = defineCommand({
  subCommands: {
    b, // Not sorted
    a,
    c: defineCommand({}), // Inline definition is not allowed
  },
});
```

**Good**

```ts
import { defineCommand } from "citty";

const a = defineCommand({});
const b = defineCommand({});
const c = defineCommand({});

export const main = defineCommand({
  subCommands: {
    a,
    b,
    c,
  },
});
```

### sort-define-command-properties

Enforce a specific order for properties in defineCommand: `meta`, `args`, `setup`, `run`, `cleanup`, `subCommands`.

**Bad**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  run() {},
  meta: {},
});
```

**Good**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  meta: {},
  run() {},
});
```

### group-command-args

Enforce a specific grouping order for command arguments: positional, then required, then optional.

**Bad**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  args: {
    optional: {},
    required: { required: true },
    positional: { type: "positional" },
  }
});
```

**Good**

```ts
import { defineCommand } from "citty";

export const main = defineCommand({
  args: {
    positional: { type: "positional" },
    required: { required: true },
    optional: {},
  }
});
```

# License

Made by [Kanon](https://github.com/ysknsid25). Publish under [MIT License](https://github.com/ysknsid25/eslint-plugin-citty/blob/master/LICENSE).

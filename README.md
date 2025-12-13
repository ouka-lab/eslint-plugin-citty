# eslint-plugin-citty

ESLint plugin for [citty](https://github.com/unjs/citty).

## Installation

```bash
npm install -D eslint-plugin-citty
```

## Usage

Add `citty` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "citty"
    ],
    "rules": {
        "citty/no-duplicated-version": "error",
        "citty/valid-version": "error",
        "citty/no-meaningless-value-hint": "warn",
        "citty/value-hint-case": "error",
        "citty/no-hidden-root-command": "warn",
        "citty/no-alias-on-positional": "error",
        "citty/enum-must-have-options": "error",
        "citty/must-have-run-or-sub-commands": "error",
        "citty/recommend-meta": "warn",
        "citty/no-empty-command-properties": "warn",
        "citty/no-default-on-positional": "warn",
        "citty/alias-should-be-short": "warn"
    }
}
```

## Rules

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
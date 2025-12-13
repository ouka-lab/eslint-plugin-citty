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
        "citty/no-meaningless-value-hint": "warn"
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

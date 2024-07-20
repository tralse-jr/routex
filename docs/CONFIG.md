# [<](../README.md#configuration) Routex Configuration

Routex configuration is set by importing `defineConfig`.

```js
const { defineConfig } = require("@tralsejr/routex");
```

## Parameters

- **options** (Config) - The options object.
- **options.routesPath** (string) - Specifies the route path of the project.
- **options.plugins** - (Plugin[], optional) - Optional Routex plugins.

## Example

**CommonJS:**

```js
// routex.config.js

const { defineConfig } = require("@tralsejr/routex");
const { DinoDocs } = require("@tralsejr/routex-plugins-dino-docs");

module.exports = defineConfig({
  routesPath: "./routes",
  plugins: [DinoDocs()], // optional
});
```

**ESM:**

```js
// routex.config.mjs

import { defineConfig } from "@tralsejr/routex";
import { DinoDocs } from "@tralsejr/routex-plugins-dino-docs";

export default defineConfig({
  routesPath: "./routes",
  plugins: [DinoDocs()], // optional
});
```

To learn more about Routex Plugins, [check out this documentation](./PLUGINS.md).

# [<](../README.md) Routex Plugins

## DinoDocs

**DinoDocs** is a special type of JSDoc which transforms into a validation middleware. To learn more about DinoDocs, [check out this documentation](https://github.com/tralsejr/dino-docs-api#readme).

### Installation

```bash
npm install @tralsejr/routex-plugins-dino-docs
```

### Usage

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

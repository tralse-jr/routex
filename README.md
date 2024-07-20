# RouteX

<span class="badge-npmversion"><a href="https://npmjs.org/package/@tralsejr/routex" title="View this project on NPM"><img src="https://img.shields.io/npm/v/%40tralsejr%2Froutex" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/%40tralsejr%2Froutex" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/%40tralsejr%2Froutex.svg" alt="NPM downloads" /></a></span>

**NOTE: This package is similar to @tralse/routex. Progress from @tralse/routex will be continued to @tralsejr/routex.**

RouteX is a lightweight package designed to simplify the management and loading of routes in an Express.js application based on configuration files. It automates the process of routing setup, allowing developers to define routes in configuration files and seamlessly integrate them into your Express.js projects.

## `RouteX` Function

The `RouteX` function in RouteX facilitates automatic loading of routes into an Express.js application based on a configuration file. It recursively scans the specified directory for route files and dynamically mounts them in the Express app, with endpoints corresponding to the file structure.

### Installation

Install RouteX via npm:

```bash
npm install @tralsejr/routex
```

### Usage

```javascript
const express = require("express");
const { RouteX } = require("@tralsejr/routex");

const app = express();

(async () => {
  // Load routes using RouteX
  await RouteX(app);

  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
```

### Configuration

To configure Routex, you need to import `defineConfig`. Then place one of the following configuration files in your project's root directory:

- **routex.config.js** - For CommonJS projects.
- **routex.config.cjs** - For CommonJS projects also.
- **routex.config.mjs** - For ESM projects.

**Example:**

```js
//routex.config.js

const { defineConfig } = require("@tralsejr/routex");

module.exports = defineConfig({
  routesPath: "./src/routes",
});
```

[Learn more about Routex Configuration](./docs/CONFIG.md)

### Function Details

#### Parameters

- `app: Express`: The Express application instance where routes will be mounted.
- `options: Options` (optional): Configuration options for debugging and reporting.

#### Options

- `debug: boolean` (optional): Enable detailed error logging.
- `makeReport: boolean` (optional): Generate a detailed report after loading routes.

### CommonJS Example

Sample structure:

```text
project/
│
├── routes/
│   │
│   ├── users/
│   │   ├── index.js
│   │   └── [id]/
│   │       └── index.js
│   │
│   ├── products.js
│   │
│   └── invoice/
│       ├── customers.js
│       └── merchants.js
│
├── routex.config.js
└── index.js
```

**/routes/users/index.js:**

```javascript
const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Users list");
});

module.exports = router;
```

**/routes/users/\[id\]/index.js:**

```javascript
const router = require("express").Router();

router.get("/", (req, res) => {
  const { id } = req.params;
  if (id) res.send("Users with id " + id);
  else res.status(400).send({ error: "Invalid id!" });
});

module.exports = router;
```

**/routes/products.js:**

```javascript
const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Products list");
});

module.exports = router;
```

**/routes/invoice/customers.js:**

```javascript
const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Customers list");
});

module.exports = router;
```

**/routes/invoice/merchants.js:**

```javascript
const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Merchants list");
});

module.exports = router;
```

**index.js:**

```javascript
const express = require("express");
const { RouteX } = require("@tralsejr/routex");

const app = express();

(async () => {
  // Load routes using RouteX
  await RouteX(app);

  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
```

### ESM Example

Sample structure:

```text
project/
│
├── routes/
│   │
│   ├── users/
│   │   ├── index.mjs
│   │   └── [id]/
│   │       └── index.mjs
│   │
│   ├── products.mjs
│   │
│   └── invoice/
│       ├── customers.mjs
│       └── merchants.mjs
│
├── routex.config.mjs
└── index.mjs
```

**/routes/users/index.mjs:**

```javascript
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Users list");
});

export default router;
```

**/routes/users/\[id\]/index.mjs:**

```javascript
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  const { id } = req.params;
  if (id) res.send("Users with id " + id);
  else res.status(400).send({ error: "Invalid id!" });
});

export default router;
```

**/routes/products.mjs:**

```javascript
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Products list");
});

export default router;
```

**/routes/invoice/customers.mjs:**

```javascript
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Customers list");
});

export default router;
```

**/routes/invoice/merchants.mjs:**

```javascript
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Merchants list");
});

export default router;
```

**index.mjs:**

```javascript
import express from "express";
import { RouteX } from "tralsejr/routex";

const app = express();

(async () => {
  // Load routes using RouteX
  await RouteX(app);

  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
```

### Running

Run your Express project via CLI:

```bash
node index.js
```

or

```bash
node index.mjs
```

After running the server, you can now access the endpoints with format:

```text
http://localhost:3000/users
http://localhost:3000/users/:id
http://localhost:3000/products
http://localhost:3000/invoice/customers
http://localhost:3000/invoice/merchants
```

**NOTE**: All files that is named index will be transformed as the endpoint following its folder name.

### Ignoring Files

RouteX allows you to ignore specific files during the route loading process by starting filenames with an underscore (`_`). This feature is useful for excluding certain files from being automatically registered as routes in your Express application.

#### Example

Assume you have a directory structure like this:

```text
project/
│
├── routes/
│ ├── _ignore.js
│ ├── users/
│ │ ├── index.js
│ │ └── [id]/
│ │ └── index.js
│ └── products.js
```

In this example, `_ignore.js` will not be loaded as a route, while routes defined in `users/` and `products.js` will be automatically registered.

To utilize this feature effectively, ensure that any files you want to ignore are prefixed with `_` in filenames.

### Options Parameter

#### Debugging

RouteX supports a debug mode to provide more detailed error information during route loading. To enable debug mode, pass `{ debug: true }` as an option when calling the RouteX function.

**Example:**

```javascript
const express = require("express");
const { RouteX } = require("@tralsejr/routex");

const app = express();

(async () => {
  await RouteX(app, { debug: true });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
```

#### Make Report

Enabling `makeReport` param in options provides a summary of the routing setup process, including the total number of files processed, successfully read, ignored, errors encountered, routes loaded, and the overall success rate.

**Example:**

```javascript
const express = require("express");
const { RouteX } = require("@tralsejr/routex");

const app = express();

(async () => {
  await RouteX(app, { makeReport: true });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
```

When `makeReport` is enabled in the options, RouteX generates a detailed report at the end of the routing process:

```text
-------- RouteX Report --------
Total files processed: 10
- Successfully read: 8
- Ignored: 1
- Errors encountered: 1
--------------------------------
Routes loaded: 8
--------------------------------
Success rate: 90.00%
```

## Routex Plugins

Check out Routex plugins by [checking this documentation](./docs/PLUGINS.md).

## Changelogs

Stay tuned for updates. [See the CHANGELOG file](./CHANGELOG.md) for details.

## Contributing

Contributions are welcome! Fork the repository, make improvements, and submit a pull request.

## License

This project is licensed under the MIT License. [See the LICENSE file](./LICENSE) for details.

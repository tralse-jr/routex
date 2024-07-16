import { Express } from "express";
import path from "path";
import { pathToFileURL } from "url";
import { loadConfig, defineConfig } from "./config";
import { log } from "@tralse/developer-logs";
import { walkDirectory } from "./walk";

interface Options {
  debug?: boolean;
  makeReport?: boolean;
}

const loadPlugins = async (
  pluginsConfig?: { name: string; options?: {} }[]
) => {
  const plugins: { [key: string]: any } = {};
  if (pluginsConfig) {
    for (const plugin of pluginsConfig) {
      try {
        if (plugin.name === "DinoDocs") {
          plugins.DinoDocs = (await import("@tralse-jr/dino-docs")).DinoDocs;
        }
        // Add more plugins here as needed
      } catch (error) {
        log.red(`PLUGIN_ERR: Error loading plugin ${plugin.name}.`, "routex");
        throw error; // Optionally throw to stop further processing if critical
      }
    }
  }
  return plugins;
};

const loadRoute = async (
  ext: string,
  filePath: string,
  newRoutePath: string,
  plugins: { [key: string]: any },
  app: Express,
  debug?: boolean
) => {
  try {
    if (ext === ".js" || ext === ".ts") {
      const route = require(filePath);
      if (plugins.DinoDocs) {
        await plugins.DinoDocs(app, {
          filePath,
          routePath: newRoutePath,
          route,
        });
      }
      app.use(newRoutePath, route);
    } else if (ext === ".mjs") {
      const routeUrl = pathToFileURL(filePath).href;
      const { default: route } = await import(routeUrl);
      if (plugins.DinoDocs) {
        await plugins.DinoDocs(app, {
          filePath,
          routePath: newRoutePath,
          route,
        });
      }
      app.use(newRoutePath, route);
    }
    log.green(`Loaded route: ${newRoutePath}`, "routex");
    return { success: true };
  } catch (error: any) {
    log.red(
      `ROUTE_ERR: Error loading route: ${newRoutePath}. ${
        debug
          ? `Error: ${error.message}`
          : "To view full error, add a parameter {debug: true} to the RouteX method."
      }`,
      "routex"
    );
    if (debug) console.error(error);
    return { success: false };
  }
};

const RouteX = async (app: Express, options: Options = {}): Promise<void> => {
  const rootDir = process.cwd();
  const { debug = false, makeReport = false } = options;
  const config = await loadConfig();
  const plugins = await loadPlugins(config.plugins);

  const routesPath = path.resolve(rootDir, config.routesPath);

  let filesRead = 0;
  let filesSuccessRead = 0;
  let ignoredFiles = 0;
  let loadedRoutes = 0;
  let misses = 0;

  const callback = async (
    file: string,
    filePath: string,
    baseRoute: string
  ) => {
    const ext = path.extname(file);
    const routePath = path
      .join(baseRoute, path.basename(file, ext))
      .replace(/\[([^[\]]+)\]/g, ":$1")
      .replace(/\\/g, "/")
      .replace(/\/index$/, "");
    const newRoutePath = `/${routePath}`;
    const isIgnored = /\/_.*$/.test(newRoutePath);

    if (isIgnored) {
      ignoredFiles++;
      return 1; // Continue walking
    }

    const result = await loadRoute(
      ext,
      filePath,
      newRoutePath,
      plugins,
      app,
      debug
    );

    filesRead++;
    if (result.success) {
      loadedRoutes++;
      filesSuccessRead++;
    } else {
      misses++;
    }

    return 1; // Continue walking
  };

  await walkDirectory(routesPath, callback, { debug });

  if (makeReport) {
    const successRate = filesRead
      ? (((filesRead - misses) / filesRead) * 100).toFixed(2)
      : "0.00";
    const report = `
    -------- RouteX Report --------
    Total files processed: ${filesRead}
    - Successfully read: ${filesSuccessRead}
    - Ignored: ${ignoredFiles}
    - Errors encountered: ${misses}
    --------------------------------
    Routes loaded: ${loadedRoutes}
    --------------------------------
    Success rate: ${successRate}%
    `;
    log.brightBlue(report, "routex");
  }
};

export { RouteX, defineConfig };

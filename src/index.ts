import { Express } from "express";
import path from "path";
import { pathToFileURL } from "url";
import { loadConfig, defineConfig } from "./config";
import { log } from "@tralse/developer-logs";
import { walkDirectory } from "./walk";
import { loadPlugins } from "./plugin";
import { Plugin, SortedPlugins } from "./types";

interface RouteXOptions {
  debug?: boolean;
  makeReport?: boolean;
}

const loadRoute = async (
  ext: string,
  filePath: string,
  newRoutePath: string,
  plugins: SortedPlugins | undefined,
  app: Express,
  debug?: boolean
): Promise<{ success: boolean }> => {
  try {
    if (ext === ".js" || ext === ".ts") {
      const router = require(filePath);
      plugins?.middleware.forEach(({ subscriber }) => {
        subscriber(app, filePath, newRoutePath, router);
      });
      app.use(newRoutePath, router);
    } else if (ext === ".mjs") {
      const routeUrl = pathToFileURL(filePath).href;
      const { default: router } = await import(routeUrl);
      plugins?.middleware.forEach(({ subscriber }) => {
        subscriber(app, filePath, newRoutePath, router);
      });
      app.use(newRoutePath, router);
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

const RouteX = async (
  app: Express,
  options: RouteXOptions = {}
): Promise<void> => {
  const rootDir = process.cwd();
  const { debug = false, makeReport = false } = options;
  const config = await loadConfig();
  const plugins = config.plugins && loadPlugins(config.plugins as Plugin[]);

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
  ): Promise<number> => {
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
export type { Plugin };

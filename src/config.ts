import fs from "fs";
import { pathToFileURL } from "url";
import { walkDirectory } from "./walk";

interface Config {
  routesPath: string;
  plugins?: Array<{
    name: string;
    options?: {};
  }>;
}

const defaultConfig: Config = {
  routesPath: "./routes",
};

const configFiles = [
  "routex.json",
  "routex.config.js",
  "routex.config.mjs",
  "routex.config.cjs",
];

const defineConfig = (config: Config): Config => {
  return config;
};

const loadConfig = async (rootDir: string): Promise<Config> => {
  let loadedConfig: Config | null = null;

  const callback = async (
    file: string,
    filePath: string,
    baseRoute: string
  ) => {
    if (configFiles.includes(file)) {
      try {
        if (file.endsWith(".json")) {
          loadedConfig = JSON.parse(
            fs.readFileSync(filePath, "utf8")
          ) as Config;
        } else if (file.endsWith(".js") || file.endsWith(".cjs")) {
          loadedConfig = require(filePath) as Config;
        } else if (file.endsWith(".mjs")) {
          const { default: config } = await import(
            pathToFileURL(filePath).href
          );
          loadedConfig = config as Config;
        }
      } catch (error) {
        console.error(`Error loading configuration from ${filePath}:`, error);
      }

      if (loadedConfig) {
        return -1; // Stop walking if config is found
      }
    }

    return 1; // Continue walking
  };

  await walkDirectory(rootDir, callback, { debug: false });

  return loadedConfig || defaultConfig;
};

const crawl = async (): Promise<Config> => {
  const root = process.cwd();
  const config = await loadConfig(root);
  return config;
};

export { crawl as loadConfig, defineConfig };

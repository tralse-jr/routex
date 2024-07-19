import { pathToFileURL } from "url";
import { walkDirectory } from "./walk";
import { Config } from "./types";

const defaultConfig: Config = {
  routesPath: "./routes",
};

enum ConfigFiles {
  JS = "routex.config.js",
  MJS = "routex.config.mjs",
  CJS = "routex.config.cjs",
}

const defineConfig = (config: Config): Config => config;

const loadConfig = async (rootDir: string): Promise<Config> => {
  let loadedConfig: Config | null = null;

  const callback = async (file: string, filePath: string): Promise<number> => {
    if (Object.values(ConfigFiles).includes(file as ConfigFiles)) {
      try {
        if (file.endsWith(".js") || file.endsWith(".cjs")) {
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

      if (loadedConfig) return -1; // Stop walking if config is found
    }

    return 1; // Continue walking
  };

  await walkDirectory(rootDir, callback, { debug: false });

  return loadedConfig || defaultConfig;
};

const crawlConfig = async (): Promise<Config> => {
  const rootDir = process.cwd();
  return await loadConfig(rootDir);
};

export { crawlConfig as loadConfig, defineConfig };

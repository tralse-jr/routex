import { log } from "@tralse/developer-logs";
import fs from "fs";
import path from "path";

interface WalkOptions {
  debug?: boolean;
}

export type CallbackFunction = (
  file: string,
  filePath: string,
  baseRoute: string
) => Promise<any>;

/**
 * Recursively walks through a directory and applies a callback function to each file.
 *
 * @param dirPath - The path to the directory to walk through.
 * @param callback - The callback function to apply to each file.
 * @param options - Options object containing debug flag.
 * @param baseRoute - The base route to use for constructing file paths.
 * @returns A promise that resolves once the directory walk is complete.
 */
export const walkDirectory = async (
  dirPath: string,
  callback: CallbackFunction,
  options: WalkOptions = {},
  baseRoute: string = ""
): Promise<any> => {
  const { debug = false } = options;

  try {
    const files = await fs.promises.readdir(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = await fs.promises.lstat(filePath);

      if (stats.isDirectory()) {
        // Recursively walk through the directory
        const result = await walkDirectory(
          filePath,
          callback,
          { debug },
          path.join(baseRoute, file)
        );
        // Handle result if needed
        if (result === -1) return;
      } else {
        const result = await callback(file, filePath, baseRoute);

        if (result === 0) break;
        else if (result === 1) continue;
        else if (result === -1) return;
        else return result;
      }
    }
  } catch (error: any) {
    log.red(
      `DIR_ERR: Error reading directory: ${dirPath}. ${
        debug
          ? "Error details: " + error.message
          : "To view full error, add a parameter {debug: true} to the RouteX method."
      }`,
      "routex"
    );
    if (debug) console.error(error);
  }
};

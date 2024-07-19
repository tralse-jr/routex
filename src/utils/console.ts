import chalk from "chalk";

const header = "[routex]";

export const log = (...text: unknown[]) => {
  chalk.green(header, text);
};

export const info = (...text: unknown[]) => {
  chalk.blueBright(header, text);
};

export const err = (...text: unknown[]) => {
  chalk.red(header, text);
};

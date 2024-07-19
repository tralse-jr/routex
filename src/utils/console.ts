import chalk from "chalk";

const header = "[routex]";

export const log = (...text: unknown[]) => {
  console.log(chalk.green(header, text));
};

export const info = (...text: unknown[]) => {
  console.log(chalk.blueBright(header, text));
};

export const err = (...text: unknown[]) => {
  console.log(chalk.red(header, text));
};

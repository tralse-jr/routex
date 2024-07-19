import { Plugin, SortedPlugins } from "./types";

export const loadPlugins = (plugins: Plugin[]): SortedPlugins => {
  const middlewares = plugins.filter(plugin => plugin.meta.type === "middleware");

  return {
    middleware: middlewares,
  };
};

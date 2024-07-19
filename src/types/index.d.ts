import { Router, Express } from "express";

interface PluginMeta {
  name: string;
  type: string;
  builtin: PluginType;
}

export type PluginType = "middleware";

export type MiddlewareSubscriber = (app: Express, filePath: string, rootPath: string, router: Router) => Promise<void>;

interface Insertables extends MiddlewareSubscriber {}

export interface Plugin {
  meta: PluginMeta;
  subscriber: Insertables;
}

export type SortedPlugins = {
  [key in PluginType]: Plugin[];
};

export interface Config {
  routesPath: string;
  plugins?: Plugin[];
}
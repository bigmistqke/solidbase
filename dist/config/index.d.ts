import type { SolidStartOptions } from "@solidjs/start/config";
import type { Options as AutoImportOptions } from "unplugin-auto-import/dist/types.js";
import type { ComponentResolverOption } from "unplugin-icons/resolver";
import type { Options as IconsOptions } from "unplugin-icons/types";
import type { PluginOption } from "vite";
import { type MdxOptions } from "./mdx.js";
import type { IssueAutoLinkConfig } from "./remark-plugins/issue-autolink.js";
import type { SolidBaseRoutesConfig } from "./route-config.js";
export type { SolidBaseRouteOption } from "./route-config.js";
export { getSolidBaseRouteFallbackOptions } from "./route-config.js";
export interface SolidBaseConfig<ThemeConfig> {
    title?: string;
    titleTemplate?: string;
    description?: string;
    siteUrl?: string;
    llms?: boolean;
    sitemap?: boolean | SitemapConfig;
    robots?: boolean | RobotsConfig;
    logo?: string;
    issueAutolink?: IssueAutoLinkConfig | false;
    lang?: string;
    locales?: Record<string, LocaleConfig<ThemeConfig>>;
    routes?: SolidBaseRoutesConfig;
    overrides?: Array<SolidBaseRouteOverride<ThemeConfig>>;
    themeConfig?: ThemeConfig;
    editPath?: string | ((path: string) => string);
    lastUpdated?: Intl.DateTimeFormatOptions | false;
    markdown?: MdxOptions;
    icons?: Omit<IconsOptions, "compiler"> | false;
    autoImport?: (AutoImportOptions & {
        iconResolver?: ComponentResolverOption | false;
    }) | true;
}
type ResolvedConfigKeys = "title" | "description" | "llms" | "sitemap" | "robots" | "lang" | "issueAutolink" | "lastUpdated";
export type SolidBaseResolvedConfig<ThemeConfig> = Omit<SolidBaseConfig<ThemeConfig>, ResolvedConfigKeys> & Required<Pick<SolidBaseConfig<ThemeConfig>, ResolvedConfigKeys>>;
export type LocaleConfig<ThemeConfig> = {
    label: string;
    lang?: string;
    link?: string;
    themeConfig?: ThemeConfig;
};
export type SolidBaseRouteOverride<ThemeConfig> = Partial<Omit<SolidBaseConfig<ThemeConfig>, "routes" | "overrides">> & Record<string, unknown>;
export type SitemapConfig = {
    hostname?: string;
    maxUrlsPerSitemap?: number;
};
export type RobotsRule = {
    userAgent: string | string[];
    allow?: string[];
    disallow?: string[];
};
export type RobotsConfig = {
    rules?: RobotsRule[];
    sitemap?: string | false;
};
export type ThemeDefinition<Config> = {
    componentsPath: string;
    extends?: ThemeDefinition<Config>;
    config?(config: SolidBaseResolvedConfig<Config>): void;
    vite?(config: SolidBaseResolvedConfig<Config>): PluginOption | undefined;
};
export declare const solidBase: {
    plugin: (solidBaseConfig?: SolidBaseConfig<import("../default-theme/index.js").DefaultThemeConfig> | undefined) => PluginOption;
    startConfig: (config?: SolidStartOptions) => SolidStartOptions;
};
export declare function createSolidBase<ThemeConfig>(theme: ThemeDefinition<ThemeConfig>): {
    plugin: (solidBaseConfig?: SolidBaseConfig<ThemeConfig>) => PluginOption;
    startConfig: (config?: SolidStartOptions) => SolidStartOptions;
};
export declare function defineTheme<C>(def: ThemeDefinition<C>): ThemeDefinition<C>;
export type Theme<C> = ReturnType<typeof defineTheme<C>>;
export declare function normalizeSiteUrl(siteUrl: string): string;
export declare function getSiteUrl(config: Pick<SolidBaseConfig<any>, "siteUrl">): string | undefined;
export declare function getSitemapHostname(config: Pick<SolidBaseConfig<any>, "siteUrl" | "sitemap">): string | undefined;

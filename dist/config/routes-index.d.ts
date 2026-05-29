import type { SolidBaseResolvedConfig } from "./index.js";
export type RouteIndexEntry = {
    filePath: string;
    routePath: string;
    markdownPath: string;
    source: string;
    frontmatter: Record<string, unknown>;
};
export declare function getRoutesDir(root: string): string;
export declare function isNotFoundRoute(routesDir: string, filePath: string): boolean;
export declare function stripOrderingSegment(segment: string): string;
export declare function collectMarkdownFiles(dir: string): Promise<string[]>;
export declare function toRoutePath(routesDir: string, filePath: string): string;
export declare function toMarkdownPath(routePath: string): string;
export type RouteLocaleInfo = {
    locale: string;
    hreflang: string;
    groupPath: string;
    isDefaultLocale: boolean;
};
export declare function getNonRootLocalePrefixes(config: SolidBaseResolvedConfig<any>): string[];
export declare function getRouteLocaleMetadata(routePath: string, config: SolidBaseResolvedConfig<any>): RouteLocaleInfo;
export declare function isRouteIncludedByConfig(routePath: string, config: SolidBaseResolvedConfig<any>): boolean;
export declare function isDefaultLocaleRoute(routePath: string, config: SolidBaseResolvedConfig<any>): boolean;
export declare function getRoutesIndex(root: string): Promise<RouteIndexEntry[]>;

import { type SolidBaseResolvedConfig } from "./index.js";
import { type RouteIndexEntry } from "./routes-index.js";
export type SitemapAlternate = {
    hreflang: string;
    href: string;
};
export type SitemapEntry = {
    routePath: string;
    url: string;
    alternates: SitemapAlternate[];
};
export declare function buildSitemapEntries(hostname: string, config: SolidBaseResolvedConfig<any>, routes: RouteIndexEntry[]): SitemapEntry[];
export declare function getSitemapEntries(root: string, config: SolidBaseResolvedConfig<any>): Promise<SitemapEntry[]>;

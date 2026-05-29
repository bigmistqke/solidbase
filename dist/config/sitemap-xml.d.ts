import type { SitemapEntry } from "./sitemap-index.js";
export type SitemapXmlFile = {
    fileName: string;
    content: string;
};
type BuildSitemapXmlFilesOptions = {
    maxUrlsPerSitemap?: number;
};
export declare function serializeSitemap(entries: SitemapEntry[]): string;
export declare function serializeSitemapIndex(urls: string[]): string;
export declare function buildSitemapXmlFiles(hostname: string, entries: SitemapEntry[], options?: BuildSitemapXmlFilesOptions): SitemapXmlFile[];
export {};

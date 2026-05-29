export interface TableOfContentsItemData {
    title: string;
    href: string;
    children: Array<TableOfContentsItemData>;
}
export interface BaseFrontmatter {
    title?: string;
    titleTemplate?: string;
    description?: string;
    llms?: false | {
        exclude?: boolean;
    };
}
interface CurrentPageData {
    frontmatter: BaseFrontmatter;
    toc?: Array<TableOfContentsItemData>;
    editLink?: string;
    lastUpdated?: number;
}
declare const CurrentPageDataProvider: import("@solid-primitives/context").ContextProvider<{
    deferStream?: boolean;
}>;
export { CurrentPageDataProvider };
export declare function useCurrentPageData(): () => CurrentPageData | undefined;
export declare function useFrontmatter<T extends Record<string, any>>(): () => T | undefined;

export type SidebarConfig<Item = SidebarItem> = Item[] | Record<`/${string}`, Item[]>;
export type SidebarItem<T = {}> = T & (SidebarItemLink | SidebarItemSection<T>);
export interface SidebarItemLink {
    title: string;
    link: string;
    target?: string;
    rel?: string;
}
export interface SidebarItemSection<T = {}> {
    title: string;
    items: SidebarItem<T>[];
    collapsed?: boolean;
    base?: string;
}
export type SidebarItemWithMeta<T = {}> = SidebarItem<T> & {
    filePath: string;
    matterData?: any;
};
export interface FilesystemSidebarOptions {
    filter?: (item: SidebarItemWithMeta) => boolean;
    sort?: (a: SidebarItemWithMeta, b: SidebarItemWithMeta) => number;
}
export declare function createFilesystemSidebar<Item = SidebarItem>(route: string, options?: FilesystemSidebarOptions): Item[];

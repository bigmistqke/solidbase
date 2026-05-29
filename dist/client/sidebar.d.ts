import { type Accessor } from "solid-js";
import type { SidebarConfig, SidebarItem, SidebarItemLink } from "../config/sidebar.js";
export type * from "../config/sidebar.js";
declare const SidebarProvider: import("@solid-primitives/context").ContextProvider<{
    config?: SidebarConfig;
}>;
export { SidebarProvider };
export declare function useSidebar<T = {}>(): Accessor<{
    prefix: string;
    items: SidebarItem<T>[];
}>;
export declare function usePrevNext<T = {}>(): {
    prevLink: () => SidebarItemLink & T & {
        depth: number;
    };
    nextLink: () => SidebarItemLink & T & {
        depth: number;
    };
};

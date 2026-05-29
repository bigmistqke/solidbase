import { createContextProvider } from "@solid-primitives/context";
import { useLocation } from "@solidjs/router";
import { createMemo } from "solid-js";
import { stripBasePath, useLocale } from "./locale.js";
const [SidebarProvider, useSidebarRaw] = createContextProvider((props) => {
    const locale = useLocale();
    const sidebars = createMemo(() => {
        const sidebarConfig = props.config;
        if (!sidebarConfig)
            return;
        if (Array.isArray(sidebarConfig)) {
            return { "/": sidebarConfig };
        }
        if ("items" in sidebarConfig) {
            return { "/": sidebarConfig.items };
        }
        for (const key in sidebarConfig) {
            if ("items" in sidebarConfig[key]) {
                sidebarConfig[key] =
                    // @ts-expect-error backwards compat
                    sidebarConfig[key].items;
            }
        }
        return sidebarConfig;
    });
    const sidebar = createMemo(() => {
        const s = sidebars();
        if (!s)
            return;
        const sidebarsEntries = Object.entries(s);
        if (sidebarsEntries.length === 1) {
            const [prefix, sidebar] = sidebarsEntries[0];
            return { prefix, items: sidebar };
        }
        sidebarsEntries.sort(([a], [b]) => b.length - a.length);
        for (const [prefix, sidebar] of sidebarsEntries) {
            if (locale.routePath().startsWith(prefix))
                return { prefix, items: sidebar };
        }
    });
    return sidebar;
});
export { SidebarProvider };
export function useSidebar() {
    const s = useSidebarRaw();
    if (!s)
        throw new Error("useSidebar must be called underneath a SidebarProvider");
    return s;
}
function flattenSidebarItems(sidebar, depth = 0) {
    return sidebar.items.flatMap((item) => {
        if ("link" in item) {
            const isExternal = item.link.includes("//");
            return {
                target: (() => {
                    if (isExternal)
                        return "_blank";
                })(),
                rel: (() => {
                    if (isExternal || item.target === "_blank")
                        return "noopener noreferrer";
                })(),
                ...item,
                link: (() => {
                    if (isExternal)
                        return item.link;
                    if (sidebar.prefix === "/")
                        return item.link;
                    if (item.link.endsWith("/"))
                        return `${sidebar.prefix}${item.link.slice(0, -1)}`;
                    return `${sidebar.prefix}${item.link}`;
                })(),
                depth,
            };
        }
        return flattenSidebarItems({ prefix: sidebar.prefix + (item.base ?? ""), items: item.items }, depth + 1);
    });
}
export function usePrevNext() {
    const sidebar = useSidebar();
    const links = createMemo(() => {
        const s = sidebar();
        if (!s)
            return [];
        return flattenSidebarItems(s);
    });
    const location = useLocation();
    const index = createMemo(() => {
        const s = sidebar();
        if (!s)
            return -1;
        return links().findIndex((item) => "link" in item && stripBasePath(location.pathname) === item.link);
    });
    return {
        prevLink: () => links()[index() - 1],
        nextLink: () => links()[index() + 1],
    };
}
//# sourceMappingURL=sidebar.js.map
import { createContextProvider } from "@solid-primitives/context";
import { useCurrentMatches } from "@solidjs/router";
import { createResource } from "solid-js";
function getWindowPageData(path) {
    if (typeof window === "undefined" || !path)
        return;
    return window.$$SolidBase_page_data?.[path.split("?")[0]];
}
const [CurrentPageDataProvider, useCurrentPageDataContext] = createContextProvider((props) => {
    const matches = useCurrentMatches();
    const [pageData] = createResource(matches, async (m) => {
        const lastMatch = m[m.length - 1];
        // if there's no matches that's not an us problem
        if (!lastMatch)
            return;
        const { $component } = lastMatch.route.key;
        const windowPageData = getWindowPageData($component?.src);
        if (windowPageData)
            return windowPageData;
        const mod = typeof $component?.import === "function"
            ? await $component.import()
            : undefined;
        if (!mod)
            throw new Error("Failed to get page data: module not found");
        return mod.$$SolidBase_page_data;
    }, {
        get deferStream() {
            return props.deferStream ?? true;
        },
    });
    return () => pageData();
});
export { CurrentPageDataProvider };
export function useCurrentPageData() {
    return (useCurrentPageDataContext() ??
        (() => {
            throw new Error("useCurrentPageData must be called underneath a CurrentPageDataProvider");
        })());
}
export function useFrontmatter() {
    const pageData = useCurrentPageData();
    return () => pageData()?.frontmatter;
}
//# sourceMappingURL=page-data.js.map
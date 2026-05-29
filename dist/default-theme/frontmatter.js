import { createMemo } from "solid-js";
import { useFrontmatter } from "../client/index.jsx";
export function useDefaultThemeFrontmatter() {
    const frontmatter = useFrontmatter();
    return createMemo(() => {
        const data = frontmatter();
        if (!data)
            return data;
        data.editLink ??= true;
        data.lastUpdated ??= true;
        data.copyButton ??= data.layout !== "home";
        if (data?.layout === "home") {
            data.sidebar = false;
            data.footer = false;
            data.toc = false;
            data.prev = false;
            data.next = false;
            data.editLink = false;
            data.lastUpdated = false;
        }
        return data;
    });
}
//# sourceMappingURL=frontmatter.js.map
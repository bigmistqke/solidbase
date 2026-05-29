import { lstatSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
export function createFilesystemSidebar(route, options) {
    const folder = path.join(process.cwd(), route);
    const resolvedOptions = {
        filter: (item) => {
            return item.matterData?.excludeFromSidebar !== true;
        },
        sort: (a, b) => {
            if (stripExtension(a.filePath).endsWith("index"))
                return -1;
            if (a.filePath > b.filePath)
                return 1;
            if (b.filePath > a.filePath)
                return -1;
            return 0;
        },
        ...options,
    };
    const items = readdirSync(folder)
        .flatMap((file) => {
        return traverse(path.join(folder, file), folder, resolvedOptions);
    })
        .filter(Boolean);
    const transform = (items) => {
        return items
            .filter(resolvedOptions.filter)
            .sort(resolvedOptions.sort)
            .map((item) => {
            if ("items" in item)
                return stripMeta({
                    ...item,
                    items: transform(item.items),
                });
            return stripMeta(item);
        });
    };
    return transform(items);
}
function traverse(filePath, baseFolder, options) {
    const title = formatTitle(path.basename(filePath));
    if (title.includes("[..."))
        return;
    if (lstatSync(filePath).isFile()) {
        const matterData = getMatterData(filePath);
        return {
            title: getMatterData(filePath).title ?? title,
            link: `/${removeParenthesesGroups(stripExtension(path.relative(baseFolder, filePath)))}`
                .replace(/\/index$/, "")
                .replaceAll("//", "/"),
            filePath,
            matterData,
        };
    }
    const items = readdirSync(filePath)
        .flatMap((file) => {
        return traverse(path.join(filePath, file), baseFolder, options);
    })
        .filter(Boolean);
    if (title === "") {
        return items;
    }
    return {
        title,
        items,
        filePath,
    };
}
function stripExtension(filePath) {
    return `${path.parse(filePath).dir}/${path.parse(filePath).name}`;
}
function getMatterData(filePath) {
    return matter.read(filePath).data;
}
function formatTitle(filePath) {
    return removeParenthesesGroups(stripExtension(filePath))
        .substring(1)
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
}
function removeParenthesesGroups(s) {
    return s.replaceAll(/\((\w|-|_)+\)/g, "").replaceAll("//", "/");
}
function stripMeta(item) {
    const stripped = item;
    stripped.filePath = undefined;
    stripped.matterData = undefined;
    return item;
}
//# sourceMappingURL=sidebar.js.map
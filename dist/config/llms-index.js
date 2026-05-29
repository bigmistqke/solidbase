import { toDocumentMarkdown } from "./document-markdown.js";
import { viteAliasCodeImports } from "./remark-plugins/import-code-file.js";
import { getRoutesIndex, isDefaultLocaleRoute, isRouteIncludedByConfig, } from "./routes-index.js";
function isExcluded(frontmatter) {
    return frontmatter.llms === false || frontmatter.llms?.exclude === true;
}
function getRootSidebarItems(sidebar) {
    if (!sidebar)
        return [];
    if (Array.isArray(sidebar))
        return sidebar;
    return sidebar["/"] ?? [];
}
function getSidebar(config) {
    const themeConfig = config.themeConfig;
    if (themeConfig &&
        typeof themeConfig === "object" &&
        "sidebar" in themeConfig) {
        return themeConfig.sidebar;
    }
    return undefined;
}
function getNav(config) {
    const themeConfig = config.themeConfig;
    if (themeConfig && typeof themeConfig === "object" && "nav" in themeConfig) {
        return themeConfig.nav;
    }
    return undefined;
}
function joinRoutePath(basePath, link) {
    if (link === "/")
        return basePath;
    if (link.startsWith(`${basePath}/`) || link === basePath)
        return link;
    if (!link.startsWith("/"))
        return `${basePath}/${link}`.replaceAll("//", "/");
    return `${basePath}${link}`.replaceAll("//", "/");
}
function resolveSidebarItems(items, basePath) {
    return items.map((item) => ({
        ...item,
        link: item.link
            ? basePath
                ? joinRoutePath(basePath, item.link)
                : item.link
            : undefined,
        items: item.items ? resolveSidebarItems(item.items, basePath) : undefined,
    }));
}
export async function getLlmDocuments(root, config, resolver) {
    if (!config.llms)
        return [];
    const routes = await getRoutesIndex(root);
    return Promise.all(routes.map(async (route) => {
        const frontmatter = route.frontmatter;
        if (isExcluded(frontmatter))
            return null;
        if (!isRouteIncludedByConfig(route.routePath, config))
            return null;
        const source = (await viteAliasCodeImports(resolver).transform(route.source, route.filePath)) ?? route.source;
        return {
            title: typeof frontmatter.title === "string"
                ? frontmatter.title
                : route.routePath,
            description: typeof frontmatter.description === "string"
                ? frontmatter.description
                : undefined,
            routePath: route.routePath,
            markdownPath: route.markdownPath,
            content: await toDocumentMarkdown(source, {
                config,
                filePath: route.filePath,
            }),
        };
    })).then((documents) => documents.filter((document) => document !== null));
}
function toDocumentHref(markdownPath, origin) {
    if (!origin)
        return markdownPath;
    return new URL(markdownPath, origin).toString();
}
function addHeadingSpacing(lines) {
    const spaced = [];
    for (const line of lines) {
        if (line.startsWith("#") && spaced.at(-1) && spaced.at(-1) !== "") {
            spaced.push("");
        }
        spaced.push(line);
    }
    return spaced;
}
export function buildLlmsIndex(origin, config, documents) {
    const defaultLocaleDocuments = documents.filter((document) => isDefaultLocaleRoute(document.routePath, config));
    const indexDocuments = defaultLocaleDocuments.length > 0 ? defaultLocaleDocuments : documents;
    const byRoutePath = new Map(indexDocuments.map((document) => [document.routePath, document]));
    const renderedRoutePaths = new Set();
    const renderItem = (item, headingLevel) => {
        const children = (item.items ?? []).flatMap((child) => renderItem(child, Math.min(headingLevel + 1, 6)));
        if (item.link) {
            const document = byRoutePath.get(item.link);
            if (!document)
                return children;
            renderedRoutePaths.add(document.routePath);
            const description = document.description
                ? `: ${document.description}`
                : "";
            return [
                `- [${item.title}](${toDocumentHref(document.markdownPath, origin)})${description}`,
                ...children,
            ];
        }
        if (children.length === 0)
            return [];
        return [`${"#".repeat(headingLevel)} ${item.title}`, "", ...children];
    };
    const sidebar = getSidebar(config);
    const nav = getNav(config);
    const keyedSidebar = sidebar && !Array.isArray(sidebar)
        ? sidebar
        : undefined;
    const rootSectionEntries = resolveSidebarItems(getRootSidebarItems(sidebar)).map((item) => ({
        title: item.title,
        items: item.items ?? (item.link ? [{ title: item.title, link: item.link }] : []),
    }));
    const sectionEntries = Array.isArray(sidebar)
        ? rootSectionEntries
        : (nav
            ?.filter((item) => Boolean(item.link && keyedSidebar?.[item.link]))
            .map((item) => ({
            title: item.text,
            items: resolveSidebarItems(keyedSidebar?.[item.link] ?? [], item.link),
        })) ?? rootSectionEntries);
    const sections = sectionEntries
        .map((section) => {
        const lines = addHeadingSpacing(section.items.flatMap((item) => renderItem(item, 3)));
        if (lines.length === 0)
            return null;
        return [`## ${section.title}`, "", ...lines].join("\n");
    })
        .filter((section) => section !== null)
        .join("\n\n");
    const topLevelDocuments = indexDocuments
        .filter((document) => !renderedRoutePaths.has(document.routePath))
        .map((document) => {
        const description = document.description
            ? `: ${document.description}`
            : "";
        return `- [${document.title}](${toDocumentHref(document.markdownPath, origin)})${description}`;
    })
        .join("\n");
    const fallbackSections = indexDocuments
        .map((document) => {
        const description = document.description
            ? `: ${document.description}`
            : "";
        return `- [${document.title}](${toDocumentHref(document.markdownPath, origin)})${description}`;
    })
        .join("\n");
    return [
        `# ${config.title}`,
        "",
        config.description,
        "",
        topLevelDocuments && sections
            ? `${topLevelDocuments}\n\n${sections}`
            : topLevelDocuments || sections || fallbackSections,
    ].join("\n");
}
export function getDocumentByPath(documents, pathname) {
    return documents.find((document) => document.markdownPath === pathname);
}
//# sourceMappingURL=llms-index.js.map
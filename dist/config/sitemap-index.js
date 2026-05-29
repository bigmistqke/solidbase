import { getSitemapHostname, normalizeSiteUrl, } from "./index.js";
import { getRouteLocaleMetadata, getRoutesIndex, isRouteIncludedByConfig, } from "./routes-index.js";
function isSitemapExcluded(frontmatter) {
    if (frontmatter.sitemap === false)
        return true;
    if (frontmatter.sitemap && typeof frontmatter.sitemap === "object") {
        return frontmatter.sitemap.exclude === true;
    }
    return false;
}
function toAbsoluteUrl(hostname, routePath) {
    return new URL(routePath, normalizeSiteUrl(hostname)).toString();
}
export function buildSitemapEntries(hostname, config, routes) {
    const includedRoutes = routes.filter((route) => !isSitemapExcluded(route.frontmatter) &&
        isRouteIncludedByConfig(route.routePath, config));
    const groups = new Map();
    for (const route of includedRoutes) {
        const localeInfo = getRouteLocaleMetadata(route.routePath, config);
        const entry = {
            routePath: route.routePath,
            url: toAbsoluteUrl(hostname, route.routePath),
            hreflang: localeInfo.hreflang,
            locale: localeInfo.locale,
            isDefaultLocale: localeInfo.isDefaultLocale,
        };
        const group = groups.get(localeInfo.groupPath);
        if (group) {
            group.push(entry);
        }
        else {
            groups.set(localeInfo.groupPath, [entry]);
        }
    }
    return includedRoutes
        .map((route) => {
        const localeInfo = getRouteLocaleMetadata(route.routePath, config);
        const variants = groups.get(localeInfo.groupPath) ?? [];
        return {
            routePath: route.routePath,
            url: toAbsoluteUrl(hostname, route.routePath),
            alternates: [
                ...variants.map(({ hreflang, url }) => ({ hreflang, href: url })),
                ...(variants.length > 1
                    ? (() => {
                        const defaultVariant = variants.find((variant) => variant.isDefaultLocale);
                        return defaultVariant
                            ? [{ hreflang: "x-default", href: defaultVariant.url }]
                            : [];
                    })()
                    : []),
            ].sort((a, b) => a.hreflang.localeCompare(b.hreflang) ||
                a.href.localeCompare(b.href)),
        };
    })
        .sort((a, b) => a.routePath.localeCompare(b.routePath));
}
export async function getSitemapEntries(root, config) {
    const hostname = getSitemapHostname(config);
    if (!hostname)
        return [];
    const routes = await getRoutesIndex(root);
    return buildSitemapEntries(hostname, config, routes);
}
//# sourceMappingURL=sitemap-index.js.map
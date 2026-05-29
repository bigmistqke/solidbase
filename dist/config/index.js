import defaultTheme from "../default-theme/index.js";
import { solidBaseMdx } from "./mdx.js";
import { validateSolidBaseRoutesConfig as validateRoutes } from "./route-config.js";
import solidBaseVitePlugin from "./vite-plugin/index.js";
export { getSolidBaseRouteFallbackOptions } from "./route-config.js";
const SOLID_BASE_OVERRIDE_CONFIG_KEYS = [
    "title",
    "titleTemplate",
    "description",
    "siteUrl",
    "llms",
    "sitemap",
    "robots",
    "logo",
    "issueAutolink",
    "lang",
    "locales",
    "themeConfig",
    "editPath",
    "lastUpdated",
    "markdown",
    "icons",
    "autoImport",
];
export const solidBase = createSolidBase(defaultTheme);
export function createSolidBase(theme) {
    const plugin = (solidBaseConfig) => {
        const sbConfig = {
            title: "SolidBase",
            description: "Fully featured, fully customisable static site generation for SolidStart",
            llms: false,
            sitemap: false,
            robots: false,
            lang: "en-US",
            issueAutolink: false,
            lastUpdated: { dateStyle: "short", timeStyle: "short" },
            ...solidBaseConfig,
        };
        validateRoutes(sbConfig.routes, sbConfig.overrides, SOLID_BASE_OVERRIDE_CONFIG_KEYS);
        {
            let t = theme;
            while (t !== undefined) {
                if (t.config)
                    t.config(sbConfig);
                t = t.extends;
            }
        }
        let t = theme;
        const plugins = [];
        while (t !== undefined) {
            if (t.vite) {
                const contents = t.vite(sbConfig);
                if (contents)
                    plugins.push(contents);
            }
            t = t.extends;
        }
        plugins.reverse();
        return [
            solidBaseMdx(sbConfig),
            solidBaseVitePlugin(theme, sbConfig),
            ...plugins,
        ];
    };
    const startConfig = (config = {}) => {
        config.ssr ??= true;
        config.extensions = [
            ...new Set((config.extensions ?? []).concat(["md", "mdx"])),
        ];
        return config;
    };
    return { plugin, startConfig };
}
export function defineTheme(def) {
    return def;
}
export function normalizeSiteUrl(siteUrl) {
    return siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;
}
export function getSiteUrl(config) {
    if (!config.siteUrl)
        return undefined;
    return normalizeSiteUrl(config.siteUrl);
}
export function getSitemapHostname(config) {
    if (!config.sitemap)
        return undefined;
    if (config.sitemap !== true && config.sitemap.hostname) {
        return normalizeSiteUrl(config.sitemap.hostname);
    }
    return getSiteUrl(config);
}
//# sourceMappingURL=index.js.map
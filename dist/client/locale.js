import { solidBaseConfig } from "virtual:solidbase/config";
import { createContextProvider } from "@solid-primitives/context";
import { useLocation, useMatch, useNavigate } from "@solidjs/router";
import { createMemo, startTransition } from "solid-js";
import { getRequestEvent, isServer } from "solid-js/web";
import { buildSolidBaseRoutePath, getSolidBaseRouteMatchForPath, getSolidBaseRouteOptions, getSolidBaseRoutePathWithRest, getSolidBaseRouteSelectionForPath, } from "../config/route-config.js";
import { useSolidBaseRoutes } from "./routes.js";
export const DEFAULT_LANG_CODE = "en-US";
export const DEFAULT_LANG_LABEL = "English";
const LOCALE_AXIS = "locale";
function getRouteLocaleAxis() {
    const axis = solidBaseConfig.routes?.[LOCALE_AXIS];
    if (axis &&
        typeof axis === "object" &&
        "default" in axis &&
        "values" in axis) {
        return axis;
    }
    return undefined;
}
function routeOptionToLocale(option) {
    return {
        code: option.meta.lang
            ? String(option.meta.lang)
            : option.name === getRouteLocaleAxis()?.default
                ? (solidBaseConfig.lang ?? DEFAULT_LANG_CODE)
                : option.name,
        isRoot: option.name === getRouteLocaleAxis()?.default,
        option,
        config: {
            label: typeof option.meta.label === "string"
                ? option.meta.label
                : option.name === getRouteLocaleAxis()?.default
                    ? DEFAULT_LANG_LABEL
                    : option.name,
            lang: typeof option.meta.lang === "string" ? option.meta.lang : undefined,
            link: option.path,
        },
    };
}
const legacyLocales = (() => {
    let rootHandled = false;
    const array = Object.entries(solidBaseConfig.locales ?? {}).map(([locale, config]) => {
        if (locale === "root") {
            rootHandled = true;
            return {
                code: config.lang ?? solidBaseConfig.lang ?? DEFAULT_LANG_CODE,
                config,
                isRoot: true,
            };
        }
        return { code: locale, config };
    });
    if (!rootHandled) {
        array.unshift({
            code: solidBaseConfig.lang ?? DEFAULT_LANG_CODE,
            isRoot: true,
            config: {
                label: DEFAULT_LANG_LABEL,
            },
        });
    }
    return array;
})();
function getLegacyLocaleForPath(path) {
    for (const locale of legacyLocales) {
        if (locale.isRoot)
            continue;
        if (path.startsWith(locale.config.link ?? `/${locale.code}`))
            return locale;
    }
    return legacyLocales.find((l) => l.isRoot);
}
function getRouteLocaleForPath(path) {
    const selection = getSolidBaseRouteSelectionForPath(solidBaseConfig.routes, path);
    const value = selection?.[LOCALE_AXIS];
    if (!value)
        return undefined;
    const option = getSolidBaseRouteOptions(solidBaseConfig.routes, LOCALE_AXIS, {
        ...selection,
        [LOCALE_AXIS]: value,
    }).find((option) => option.name === value);
    return option ? routeOptionToLocale(option) : undefined;
}
function getLocaleForPath(path) {
    return getRouteLocaleForPath(path) ?? getLegacyLocaleForPath(path);
}
function normalizeClientPath(path) {
    return (path.startsWith("/") ? path : `/${path}`);
}
function isExternalPath(path) {
    return path.includes("://") || path.startsWith("//");
}
function isPathWithinPrefix(path, prefix) {
    return path === prefix || path.startsWith(`${prefix}/`);
}
// import.meta.env.BASE_URL is the configured deploy base ("/" by default).
// Router and location pathnames carry it, but SolidBase matches routes and
// sidebars against app-relative paths, so strip the base before matching.
const BASE_PREFIX = import.meta.env.BASE_URL.replace(/\/+$/, "");
export function stripBasePath(pathname) {
    if (!BASE_PREFIX)
        return pathname;
    if (pathname === BASE_PREFIX)
        return "/";
    return pathname.startsWith(`${BASE_PREFIX}/`)
        ? pathname.slice(BASE_PREFIX.length)
        : pathname;
}
const [LocaleContextProvider, useLocaleContext] = createContextProvider(() => {
    const location = useLocation();
    const navigate = useNavigate();
    const routes = useSolidBaseRoutes();
    const pathname = createMemo(() => stripBasePath(location.pathname));
    const currentLocale = createMemo(() => getLocaleForPath(pathname()));
    const currentRouteMatch = createMemo(() => getSolidBaseRouteMatchForPath(solidBaseConfig.routes, pathname()));
    const locales = createMemo(() => {
        if (!solidBaseConfig.routes)
            return legacyLocales;
        const match = currentRouteMatch();
        if (!match)
            return [];
        return routes
            .options(LOCALE_AXIS, match.selection)
            .map(routeOptionToLocale);
    });
    const match = useMatch(() => `${getLocaleLink(currentLocale())}*rest`);
    return {
        get locales() {
            return locales();
        },
        currentLocale,
        setLocale: (locale) => {
            if (locale.option) {
                const routePath = getSolidBaseRoutePathWithRest(solidBaseConfig.routes, {
                    ...routes.current(),
                    [LOCALE_AXIS]: locale.option.name,
                }, currentRouteMatch()?.restPath ?? "/");
                if (!routePath)
                    return;
                startTransition(() => navigate(routePath)).then(() => {
                    document.documentElement.lang = locale.code;
                });
                return;
            }
            const searchValue = getLocaleLink(locale);
            startTransition(() => navigate(`${searchValue}${match()?.params.rest ?? ""}`)).then(() => {
                document.documentElement.lang = locale.code;
            });
        },
        applyPathPrefix: (_path) => {
            if (solidBaseConfig.routes && !isExternalPath(_path)) {
                const path = normalizeClientPath(_path);
                const pathMatch = getSolidBaseRouteMatchForPath(solidBaseConfig.routes, path);
                const pathPrefix = pathMatch &&
                    buildSolidBaseRoutePath(solidBaseConfig.routes, pathMatch.selection);
                if (pathPrefix &&
                    pathPrefix !== "/" &&
                    isPathWithinPrefix(path, pathPrefix)) {
                    return path;
                }
                const routePath = getSolidBaseRoutePathWithRest(solidBaseConfig.routes, routes.current(), path);
                if (routePath)
                    return routePath;
            }
            let path = _path;
            const link = getLocaleLink(currentLocale());
            if (link === "/") {
                const normalizedPath = path.startsWith("/") ? path : `/${path}`;
                return normalizedPath;
            }
            if (path.startsWith("/"))
                path = path.slice(1);
            return `${link}${path}`;
        },
        routePath: () => {
            const routePath = currentRouteMatch()?.restPath;
            if (routePath)
                return routePath;
            const rest = match()?.params.rest;
            if (!rest)
                return "/";
            return stripBasePath(`/${rest}`);
        },
    };
});
export { LocaleContextProvider };
export function useLocale() {
    return (useLocaleContext() ??
        (() => {
            throw new Error("useLocale must be called underneath a LocaleContextProvider");
        })());
}
export const getLocaleLink = (locale) => (locale.option?.path ??
    locale.config?.link ??
    `/${locale.isRoot ? "" : `${locale.code}/`}`);
export function getLocale(_path) {
    let path = _path;
    if (path === undefined) {
        if (isServer) {
            const e = getRequestEvent();
            if (!e)
                throw new Error("getLang must be called in a request context");
            path = stripBasePath(new URL(e.request.url).pathname);
        }
        else {
            path = stripBasePath(location.pathname);
        }
    }
    return getLocaleForPath(path);
}
//# sourceMappingURL=locale.js.map
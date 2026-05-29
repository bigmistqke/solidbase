import type { LocaleConfig } from "../config/index.js";
import { type SolidBaseRouteOption } from "../config/route-config.js";
export declare const DEFAULT_LANG_CODE = "en-US";
export declare const DEFAULT_LANG_LABEL = "English";
export interface ResolvedLocale<ThemeConfig> {
    code: string;
    isRoot?: boolean;
    config: LocaleConfig<ThemeConfig>;
    option?: SolidBaseRouteOption;
}
export declare function stripBasePath(pathname: string): string;
declare const LocaleContextProvider: import("@solid-primitives/context").ContextProvider<import("@solid-primitives/context").ContextProviderProps>;
export { LocaleContextProvider };
export declare function useLocale(): {
    readonly locales: ResolvedLocale<any>[];
    currentLocale: import("solid-js").Accessor<ResolvedLocale<any>>;
    setLocale: (locale: ResolvedLocale<any>) => void;
    applyPathPrefix: (_path: string) => `/${string}`;
    routePath: () => string;
};
export declare const getLocaleLink: (locale: ResolvedLocale<any>) => `/${string}`;
export declare function getLocale(_path?: string): ResolvedLocale<any>;

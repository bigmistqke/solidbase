import type { DefaultThemeConfig } from "./index.js";
export declare function useSolidBaseContext(): import("../client/context.jsx").SolidBaseContextValue<DefaultThemeConfig>;
export declare function useRouteConfig(): import("solid-js").Accessor<import("../config/index.js").SolidBaseResolvedConfig<DefaultThemeConfig>>;
export declare function useThemeText(): {
    editPage: string;
    copyPage: string;
    copiedPage: string;
    copyFailedPage: string;
};

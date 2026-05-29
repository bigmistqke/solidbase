import { useRouteSolidBaseConfig as _useRouteConfig, useSolidBaseContext as _useSolidBaseContext, } from "../client/index.jsx";
import { defaultThemeTextConfig } from "./text.js";
export function useSolidBaseContext() {
    return _useSolidBaseContext();
}
export function useRouteConfig() {
    return _useRouteConfig();
}
export function useThemeText() {
    const config = useRouteConfig();
    return {
        ...defaultThemeTextConfig,
        ...config().themeConfig?.text,
    };
}
//# sourceMappingURL=utils.js.map
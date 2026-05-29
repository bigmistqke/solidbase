import { solidBaseConfig } from "virtual:solidbase/config";
import { createMemo } from "solid-js";
import { resolveSolidBaseRouteConfig } from "../config/route-config.js";
import { useLocale } from "./locale.js";
import { useSolidBaseRoute } from "./routes.js";
export function useRouteSolidBaseConfig() {
    const { currentLocale } = useLocale();
    const currentRoute = useSolidBaseRoute();
    return createMemo(() => {
        const routeConfig = resolveSolidBaseRouteConfig(solidBaseConfig, currentRoute());
        const localeConfig = currentLocale().config.themeConfig ?? {};
        return {
            ...routeConfig,
            themeConfig: { ...routeConfig.themeConfig, ...localeConfig },
        };
    });
}
//# sourceMappingURL=config.js.map
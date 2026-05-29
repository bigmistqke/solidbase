import { solidBaseConfig } from "virtual:solidbase/config";
import { createContextProvider } from "@solid-primitives/context";
import { useLocation } from "@solidjs/router";
import { createMemo } from "solid-js";
import { buildSolidBaseRoutePath, getSolidBaseRouteOptions, getSolidBaseRouteSelectionForPath, normalizeSolidBaseRouteSelection, } from "../config/route-config.js";
const [SolidBaseRoutesContextProvider, useSolidBaseRoutesContext] = createContextProvider(() => {
    const location = useLocation();
    const current = createMemo(() => getSolidBaseRouteSelectionForPath(solidBaseConfig.routes, location.pathname) ??
        normalizeSolidBaseRouteSelection(solidBaseConfig.routes) ??
        {});
    return {
        routes: solidBaseConfig.routes,
        current,
        path: (selection) => buildSolidBaseRoutePath(solidBaseConfig.routes, {
            ...current(),
            ...selection,
        }),
        options: (axis, selection) => getSolidBaseRouteOptions(solidBaseConfig.routes, axis, selection ?? current()),
    };
});
export { SolidBaseRoutesContextProvider };
export function useSolidBaseRoutes() {
    return (useSolidBaseRoutesContext() ??
        (() => {
            throw new Error("useSolidBaseRoutes must be called underneath a SolidBaseRoutesContextProvider");
        })());
}
export function useSolidBaseRoute() {
    return useSolidBaseRoutes().current;
}
export function useSolidBaseRouteOptions(axis) {
    const routes = useSolidBaseRoutes();
    return createMemo(() => routes.options(axis));
}
//# sourceMappingURL=routes.js.map
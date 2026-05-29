import { type SolidBaseRouteOption, type SolidBaseRouteSelection } from "../config/route-config.js";
declare const SolidBaseRoutesContextProvider: import("@solid-primitives/context").ContextProvider<import("@solid-primitives/context").ContextProviderProps>;
export { SolidBaseRoutesContextProvider };
export declare function useSolidBaseRoutes(): {
    routes: import("../config/route-config.js").SolidBaseRoutesConfig | undefined;
    current: import("solid-js").Accessor<SolidBaseRouteSelection>;
    path: (selection: Partial<SolidBaseRouteSelection>) => `/${string}` | undefined;
    options: (axis: string, selection?: Partial<SolidBaseRouteSelection>) => SolidBaseRouteOption[];
};
export declare function useSolidBaseRoute(): import("solid-js").Accessor<SolidBaseRouteSelection>;
export declare function useSolidBaseRouteOptions(axis: string): import("solid-js").Accessor<SolidBaseRouteOption[]>;

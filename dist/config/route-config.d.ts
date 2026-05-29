export type SolidBaseRouteSelection = Record<string, string>;
export type SolidBaseRouteRule = Record<string, string | string[]>;
export type SolidBaseRouteValueConfig = {
    path?: string;
    href?: string;
    label?: string;
    title?: string;
    status?: string;
    lang?: string;
} & Record<string, unknown>;
export type SolidBaseRouteAxisConfig = {
    default: string;
    values: Record<string, SolidBaseRouteValueConfig>;
};
export type SolidBaseRoutesConfig = {
    path: `/${string}`;
    include?: SolidBaseRouteRule[];
    [key: string]: `/${string}` | SolidBaseRouteRule[] | SolidBaseRouteAxisConfig | undefined;
};
export type SolidBaseRouteOption = {
    name: string;
    axis: string;
    path?: string;
    href?: string;
    isExternal: boolean;
    selection?: SolidBaseRouteSelection;
    meta: SolidBaseRouteValueConfig;
};
export type SolidBaseRoutePathMatch = {
    selection: SolidBaseRouteSelection;
    restPath: `/${string}`;
};
type RouteConfigValue = Record<string, unknown>;
export declare function isSolidBaseRouteAxisConfig(value: unknown): value is SolidBaseRouteAxisConfig;
export declare function getSolidBaseRouteAxes(routes: SolidBaseRoutesConfig | undefined): [string, SolidBaseRouteAxisConfig][];
export declare function getSolidBaseRouteAxisNames(routes: SolidBaseRoutesConfig | undefined): string[];
export declare function validateSolidBaseRoutesConfig(routes: SolidBaseRoutesConfig | undefined, overrides?: RouteConfigValue[], overrideConfigKeys?: Iterable<string>): void;
export declare function normalizeSolidBaseRouteSelection(routes: SolidBaseRoutesConfig | undefined, selection?: Partial<SolidBaseRouteSelection>): SolidBaseRouteSelection | undefined;
export declare function matchesSolidBaseRouteRule(selection: SolidBaseRouteSelection, rule: SolidBaseRouteRule): boolean;
export declare function isSolidBaseRouteIncluded(routes: SolidBaseRoutesConfig | undefined, selection: Partial<SolidBaseRouteSelection>): boolean;
export declare function buildSolidBaseRoutePath(routes: SolidBaseRoutesConfig | undefined, selection?: Partial<SolidBaseRouteSelection>): `/${string}` | undefined;
export declare function getSolidBaseRouteSelectionForPath(routes: SolidBaseRoutesConfig | undefined, path: string): SolidBaseRouteSelection | undefined;
export declare function getSolidBaseRouteMatchForPath(routes: SolidBaseRoutesConfig | undefined, path: string): {
    selection: SolidBaseRouteSelection;
    restPath: `/${string}`;
} | undefined;
export declare function getSolidBaseRoutePathWithRest(routes: SolidBaseRoutesConfig | undefined, selection: Partial<SolidBaseRouteSelection>, restPath: string): `/${string}` | undefined;
export declare function getSolidBaseRouteFallbackSelection(routes: SolidBaseRoutesConfig | undefined, current?: Partial<SolidBaseRouteSelection>, next?: Partial<SolidBaseRouteSelection>, options?: {
    lockedAxes?: string[];
}): SolidBaseRouteSelection | undefined;
export declare function getSolidBaseRouteOptions(routes: SolidBaseRoutesConfig | undefined, axisName: string, current?: Partial<SolidBaseRouteSelection>): SolidBaseRouteOption[];
export declare function getSolidBaseRouteFallbackOptions(routes: SolidBaseRoutesConfig | undefined, axisName: string, current?: Partial<SolidBaseRouteSelection>): SolidBaseRouteOption[];
export declare function resolveSolidBaseRouteConfig<T extends RouteConfigValue>(baseConfig: T & {
    overrides?: RouteConfigValue[];
    routes?: SolidBaseRoutesConfig;
}, selection: Partial<SolidBaseRouteSelection>): T;
export {};

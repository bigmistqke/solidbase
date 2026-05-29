const ROUTES_RESERVED_KEYS = new Set(["path", "include"]);
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function isSolidBaseRouteAxisConfig(value) {
    return (isRecord(value) &&
        typeof value.default === "string" &&
        isRecord(value.values));
}
export function getSolidBaseRouteAxes(routes) {
    if (!routes)
        return [];
    return Object.entries(routes).filter((entry) => isSolidBaseRouteAxisConfig(entry[1]));
}
export function getSolidBaseRouteAxisNames(routes) {
    return getSolidBaseRouteAxes(routes).map(([name]) => name);
}
function getSolidBaseRouteAxisMap(routes) {
    return new Map(getSolidBaseRouteAxes(routes));
}
function assertSolidBaseRouteConfig(condition, message) {
    if (!condition)
        throw new Error(`[SolidBase]: ${message}`);
}
function trimSlashes(value) {
    return value.replace(/^\/+|\/+$/g, "");
}
function normalizeRoutePath(path) {
    const normalized = `/${path
        .split("/")
        .map((segment) => trimSlashes(segment))
        .filter(Boolean)
        .join("/")}`;
    return normalized;
}
function getRouteTemplateSegments(path) {
    return path
        .split("/")
        .map((segment) => trimSlashes(segment))
        .filter(Boolean)
        .map((segment) => {
        const match = segment.match(/^\{([^}]+)\}$/);
        if (match)
            return { type: "axis", name: match[1] };
        return { type: "static", value: segment };
    });
}
function getRouteTemplateAxisNames(path) {
    return getRouteTemplateSegments(path)
        .filter((segment) => {
        return segment.type === "axis";
    })
        .map((segment) => segment.name);
}
function toRuleValues(value) {
    return Array.isArray(value) ? value : [value];
}
function validateRouteRule(rule, axisMap, source) {
    for (const [axisName, value] of Object.entries(rule)) {
        const axis = axisMap.get(axisName);
        assertSolidBaseRouteConfig(axis, `\`${source}\` references unknown route axis \`${axisName}\`.`);
        for (const valueName of toRuleValues(value)) {
            assertSolidBaseRouteConfig(Object.hasOwn(axis.values, valueName), "`" +
                source +
                "` references unknown `" +
                axisName +
                "` value `" +
                valueName +
                "`.");
        }
    }
}
function getInternalRouteValueEntries(axis) {
    return Object.entries(axis.values).filter(([, value]) => !value.href);
}
function getSolidBaseRouteSelections(routes) {
    const axes = getSolidBaseRouteAxes(routes);
    const selections = [];
    const visit = (index, selection) => {
        const entry = axes[index];
        if (!entry) {
            if (isSolidBaseRouteIncluded(routes, selection)) {
                selections.push(selection);
            }
            return;
        }
        const [axisName, axis] = entry;
        for (const [valueName] of getInternalRouteValueEntries(axis)) {
            visit(index + 1, { ...selection, [axisName]: valueName });
        }
    };
    visit(0, {});
    return selections;
}
function matchRoutePathSegment(axis, pathSegment) {
    const entries = getInternalRouteValueEntries(axis);
    const defaultEntry = entries.find(([valueName]) => valueName === axis.default);
    const explicitMatch = pathSegment === undefined
        ? undefined
        : entries.find(([, value]) => {
            const valuePath = trimSlashes(value.path ?? "");
            return valuePath !== "" && pathSegment === valuePath;
        });
    if (explicitMatch)
        return explicitMatch;
    if (!defaultEntry)
        return undefined;
    const defaultPath = trimSlashes(defaultEntry[1].path ?? defaultEntry[0]);
    return defaultPath === "" ? defaultEntry : undefined;
}
function getRouteValuePath(valueName, value) {
    return trimSlashes(value.path ?? valueName);
}
export function validateSolidBaseRoutesConfig(routes, overrides = [], overrideConfigKeys = []) {
    if (!routes)
        return;
    const axisMap = getSolidBaseRouteAxisMap(routes);
    const configKeys = new Set(overrideConfigKeys);
    const placeholders = getRouteTemplateAxisNames(routes.path);
    assertSolidBaseRouteConfig(placeholders.length > 0, "`routes.path` must include at least one route axis placeholder.");
    for (const key of Object.keys(routes)) {
        if (ROUTES_RESERVED_KEYS.has(key))
            continue;
        assertSolidBaseRouteConfig(axisMap.has(key), `\`routes.${key}\` must include \`default\` and \`values\`.`);
    }
    for (const axisName of placeholders) {
        assertSolidBaseRouteConfig(axisMap.has(axisName), `\`routes.path\` references unknown route axis \`${axisName}\`.`);
    }
    for (const [axisName, axis] of axisMap) {
        assertSolidBaseRouteConfig(placeholders.includes(axisName), "`routes." +
            axisName +
            "` must be included in `routes.path` as `{" +
            axisName +
            "}`.");
        assertSolidBaseRouteConfig(Object.hasOwn(axis.values, axis.default), "`routes." +
            axisName +
            ".default` must reference a key in `routes." +
            axisName +
            ".values`.");
    }
    for (const rule of routes.include ?? []) {
        validateRouteRule(rule, axisMap, "routes.include");
    }
    for (const override of overrides) {
        const selectors = {};
        for (const [key, value] of Object.entries(override)) {
            if (axisMap.has(key)) {
                assertSolidBaseRouteConfig(typeof value === "string" || Array.isArray(value), "`overrides` selector `" +
                    key +
                    "` must be a string or string array.");
                selectors[key] = value;
                continue;
            }
            assertSolidBaseRouteConfig(configKeys.has(key), `\`overrides\` contains unknown config key or route axis \`${key}\`.`);
        }
        validateRouteRule(selectors, axisMap, "overrides");
    }
}
export function normalizeSolidBaseRouteSelection(routes, selection = {}) {
    const normalized = {};
    for (const [axisName, axisConfig] of getSolidBaseRouteAxes(routes)) {
        const valueName = selection[axisName] ?? axisConfig.default;
        const value = axisConfig.values[valueName];
        if (!value || value.href)
            return undefined;
        normalized[axisName] = valueName;
    }
    return normalized;
}
export function matchesSolidBaseRouteRule(selection, rule) {
    for (const [axisName, allowed] of Object.entries(rule)) {
        const current = selection[axisName];
        if (Array.isArray(allowed)) {
            if (!current || !allowed.includes(current))
                return false;
            continue;
        }
        if (current !== allowed)
            return false;
    }
    return true;
}
export function isSolidBaseRouteIncluded(routes, selection) {
    const normalized = normalizeSolidBaseRouteSelection(routes, selection);
    if (!normalized)
        return false;
    if (!routes?.include)
        return true;
    return routes.include.some((rule) => matchesSolidBaseRouteRule(normalized, rule));
}
export function buildSolidBaseRoutePath(routes, selection = {}) {
    const normalized = normalizeSolidBaseRouteSelection(routes, selection);
    if (!routes || !normalized || !isSolidBaseRouteIncluded(routes, normalized)) {
        return undefined;
    }
    const axes = getSolidBaseRouteAxisMap(routes);
    const pathSegments = getRouteTemplateSegments(routes.path).map((segment) => {
        if (segment.type === "static")
            return segment.value;
        const axis = axes.get(segment.name);
        const valueName = normalized[segment.name];
        if (!axis || !valueName)
            return "";
        const value = axis.values[valueName];
        return trimSlashes(value?.path ?? valueName);
    });
    return normalizeRoutePath(pathSegments.join("/"));
}
export function getSolidBaseRouteSelectionForPath(routes, path) {
    return getSolidBaseRouteMatchForPath(routes, path)?.selection;
}
export function getSolidBaseRouteMatchForPath(routes, path) {
    if (!routes)
        return undefined;
    const axes = getSolidBaseRouteAxisMap(routes);
    const pathSegments = trimSlashes(path).split("/").filter(Boolean);
    const selection = {};
    let pathIndex = 0;
    for (const segment of getRouteTemplateSegments(routes.path)) {
        if (segment.type === "static") {
            if (pathSegments[pathIndex] !== segment.value)
                return undefined;
            pathIndex++;
            continue;
        }
        const axis = axes.get(segment.name);
        if (!axis)
            return undefined;
        const matched = matchRoutePathSegment(axis, pathSegments[pathIndex]);
        if (!matched)
            return undefined;
        const [valueName, value] = matched;
        selection[segment.name] = valueName;
        if (getRouteValuePath(valueName, value) !== "")
            pathIndex++;
    }
    if (!isSolidBaseRouteIncluded(routes, selection))
        return undefined;
    return {
        selection,
        restPath: normalizeRoutePath(pathSegments.slice(pathIndex).join("/")),
    };
}
export function getSolidBaseRoutePathWithRest(routes, selection, restPath) {
    const routePath = buildSolidBaseRoutePath(routes, selection);
    if (!routePath)
        return undefined;
    return normalizeRoutePath(`${routePath}/${restPath}`);
}
export function getSolidBaseRouteFallbackSelection(routes, current = {}, next = {}, options = {}) {
    if (!routes)
        return undefined;
    const normalizedCurrent = normalizeSolidBaseRouteSelection(routes, current) ?? {};
    const axisMap = getSolidBaseRouteAxisMap(routes);
    const lockedSelection = {};
    for (const axisName of options.lockedAxes ?? []) {
        const valueName = normalizedCurrent[axisName];
        if (valueName)
            lockedSelection[axisName] = valueName;
    }
    const requiredSelection = {
        ...lockedSelection,
        ...next,
    };
    const required = normalizeSolidBaseRouteSelection(routes, {
        ...normalizedCurrent,
        ...requiredSelection,
    });
    if (!required)
        return undefined;
    let fallback;
    let fallbackScore = -1;
    for (const selection of getSolidBaseRouteSelections(routes)) {
        if (Object.entries(requiredSelection).some(([axisName]) => {
            return selection[axisName] !== required[axisName];
        })) {
            continue;
        }
        let score = 0;
        for (const [axisName, axis] of axisMap) {
            if (selection[axisName] === normalizedCurrent[axisName]) {
                score += 100;
                continue;
            }
            if (selection[axisName] === axis.default) {
                score += 10;
            }
        }
        if (score > fallbackScore) {
            fallback = selection;
            fallbackScore = score;
        }
    }
    return fallback;
}
export function getSolidBaseRouteOptions(routes, axisName, current = {}) {
    if (!routes)
        return [];
    const axis = getSolidBaseRouteAxisMap(routes).get(axisName);
    if (!axis)
        return [];
    const normalized = normalizeSolidBaseRouteSelection(routes, current) ?? {};
    const options = [];
    for (const [valueName, value] of Object.entries(axis.values)) {
        if (value.href) {
            options.push({
                name: valueName,
                axis: axisName,
                href: value.href,
                isExternal: true,
                meta: value,
            });
            continue;
        }
        const selection = {
            ...normalized,
            [axisName]: valueName,
        };
        if (!isSolidBaseRouteIncluded(routes, selection))
            continue;
        options.push({
            name: valueName,
            axis: axisName,
            path: buildSolidBaseRoutePath(routes, selection),
            isExternal: false,
            selection,
            meta: value,
        });
    }
    return options;
}
export function getSolidBaseRouteFallbackOptions(routes, axisName, current = {}) {
    if (!routes)
        return [];
    const axis = getSolidBaseRouteAxisMap(routes).get(axisName);
    if (!axis)
        return [];
    const axisNames = getRouteTemplateAxisNames(routes.path);
    const axisIndex = axisNames.indexOf(axisName);
    const lockedAxes = axisIndex > 0 ? axisNames.slice(0, axisIndex) : [];
    const options = [];
    for (const [valueName, value] of Object.entries(axis.values)) {
        if (value.href) {
            options.push({
                name: valueName,
                axis: axisName,
                href: value.href,
                isExternal: true,
                meta: value,
            });
            continue;
        }
        const selection = getSolidBaseRouteFallbackSelection(routes, current, {
            [axisName]: valueName,
        }, { lockedAxes });
        if (!selection)
            continue;
        options.push({
            name: valueName,
            axis: axisName,
            path: buildSolidBaseRoutePath(routes, selection),
            isExternal: false,
            selection,
            meta: value,
        });
    }
    return options;
}
function splitRouteOverride(override, axisNames) {
    const selectors = {};
    const config = {};
    for (const [key, value] of Object.entries(override)) {
        if (axisNames.includes(key)) {
            if (typeof value === "string" || Array.isArray(value)) {
                selectors[key] = value;
            }
            continue;
        }
        if (key !== "routes" && key !== "overrides")
            config[key] = value;
    }
    return { selectors, config };
}
function mergeRouteConfig(base, override) {
    const result = { ...base };
    for (const [key, value] of Object.entries(override)) {
        if (key === "themeConfig" && isRecord(result[key]) && isRecord(value)) {
            result[key] = {
                ...result[key],
                ...value,
            };
            continue;
        }
        result[key] = value;
    }
    return result;
}
export function resolveSolidBaseRouteConfig(baseConfig, selection) {
    const { overrides: _overrides, ...base } = baseConfig;
    const routes = baseConfig.routes;
    if (!routes)
        return base;
    const normalized = normalizeSolidBaseRouteSelection(routes, selection);
    if (!normalized || !isSolidBaseRouteIncluded(routes, normalized)) {
        return base;
    }
    const axisNames = getSolidBaseRouteAxisNames(routes);
    let config = base;
    for (const override of baseConfig.overrides ?? []) {
        const { selectors, config: overrideConfig } = splitRouteOverride(override, axisNames);
        if (!matchesSolidBaseRouteRule(normalized, selectors))
            continue;
        config = mergeRouteConfig(config, overrideConfig);
    }
    return config;
}
//# sourceMappingURL=route-config.js.map
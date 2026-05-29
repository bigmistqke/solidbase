import type { ThemeComponents } from "./default-components.js";
declare const DefaultThemeComponentsProvider: import("@solid-primitives/context").ContextProvider<{
    components?: Partial<ThemeComponents>;
}>;
export declare function useDefaultThemeComponents(): {
    Article: typeof import("./components/Article.jsx").default;
    Badges: typeof import("./components/Badges.jsx").default;
    Footer: typeof import("./components/Footer.jsx").default;
    Header: typeof import("./components/Header.jsx").default;
    LastUpdated: typeof import("./components/LastUpdated.jsx").default;
    Link: typeof import("./components/Link.jsx").default;
    LocaleSelector: typeof import("./components/LocaleSelector.jsx").default;
    ProjectSelector: typeof import("./components/ProjectSelector.jsx").default;
    TableOfContents: typeof import("./components/TableOfContents.jsx").default;
    ThemeSelector: typeof import("./components/ThemeSelector.jsx").default;
    VersionSelector: typeof import("./components/VersionSelector.jsx").default;
    Hero: typeof import("./components/Hero.jsx").default;
    Features: typeof import("./components/Features.jsx").default;
};
declare const DefaultThemeStateProvider: import("@solid-primitives/context").ContextProvider<import("@solid-primitives/context").ContextProviderProps>;
export declare function useDefaultThemeState(): {
    sidebarOpen: import("solid-js").Accessor<boolean>;
    setSidebarOpen: import("solid-js").Setter<boolean>;
    tocOpen: import("solid-js").Accessor<boolean>;
    setTocOpen: import("solid-js").Setter<boolean>;
    navOpen: import("solid-js").Accessor<boolean>;
    setNavOpen: import("solid-js").Setter<boolean>;
    frontmatter: import("solid-js").Accessor<import("./frontmatter.js").DefaultThemeFrontmatter | undefined>;
};
export { DefaultThemeComponentsProvider, DefaultThemeStateProvider };

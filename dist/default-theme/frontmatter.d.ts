import { type BaseFrontmatter } from "../client/index.jsx";
export declare function useDefaultThemeFrontmatter(): import("solid-js").Accessor<DefaultThemeFrontmatter | undefined>;
export type RelativePageConfig = string | false | {
    text?: string;
    link?: string;
};
interface DefaultThemeBaseFrontmatter {
    sidebar?: boolean;
    footer?: boolean;
    toc?: boolean;
    prev?: RelativePageConfig;
    next?: RelativePageConfig;
    editLink?: boolean;
    lastUpdated?: boolean;
    copyButton?: boolean;
    badges?: Array<BadgeConfig>;
}
export interface BadgeConfig {
    icon?: string;
    label: string;
    url?: string;
}
interface HeroActionConfig {
    theme?: string;
    text?: string;
    link?: string;
}
export interface HeroConfig {
    name?: string;
    text?: string;
    tagline?: string;
    image?: {
        src: string;
        alt?: string;
    };
    actions?: Array<HeroActionConfig>;
}
export interface FeaturesConfig {
    icon?: string;
    title?: string;
    details?: string;
}
interface HomeLayoutFrontmatter {
    layout?: "home";
    hero?: HeroConfig;
    features?: Array<FeaturesConfig>;
}
export type DefaultThemeFrontmatter = (BaseFrontmatter & DefaultThemeBaseFrontmatter) & HomeLayoutFrontmatter;
export {};

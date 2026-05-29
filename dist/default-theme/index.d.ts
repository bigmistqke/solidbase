import type { Component, JSX } from "solid-js";
import { type ThemeDefinition } from "../config/index.js";
import type { SidebarConfig, SidebarItem } from "../config/sidebar.js";
import type { DefaultThemeTextConfig } from "./text.js";
export type { DefaultThemeTextConfig } from "./text.js";
export { defaultThemeTextConfig } from "./text.js";
export type DefaultThemeSidebarItemOptions = {
    status?: "new" | "updated" | "next" | DefaultThemeSidebarItemOptionCustomStatus;
};
export interface DefaultThemeSidebarItemOptionCustomStatus {
    text: string;
    color: string;
    textColor?: string;
}
export type DefaultThemeSidebarItem = SidebarItem<DefaultThemeSidebarItemOptions>;
export type DefaultThemeBadgeIconComponent = Component<{
    class?: string;
}> | Component<JSX.SvgSVGAttributes<SVGSVGElement>>;
export interface DefaultThemeSvgBadgeIcon {
    svg: string;
}
export interface DefaultThemeComponentBadgeIcon {
    component: DefaultThemeBadgeIconComponent;
}
export type DefaultThemeBadgeIconConfig = DefaultThemeSvgBadgeIcon | DefaultThemeComponentBadgeIcon;
export type DefaultThemeBadgeIcon = string | DefaultThemeBadgeIconComponent | DefaultThemeBadgeIconConfig;
export interface DefaultThemeBadgesConfig {
    icons?: Record<string, DefaultThemeBadgeIcon>;
}
export type DefaultThemeConfig = {
    footer?: boolean;
    socialLinks?: {
        [K in Exclude<SocialLink["type"], "custom"> | (string & {})]?: string | Omit<SocialLink, "type">;
    };
    badges?: DefaultThemeBadgesConfig;
    nav?: Array<NavItem>;
    sidebar?: SidebarConfig<DefaultThemeSidebarItem>;
    search?: SearchConfig;
    fonts?: {
        [K in keyof typeof allFonts]?: false;
    } | false;
    text?: Partial<DefaultThemeTextConfig>;
};
declare const allFonts: {
    inter: {
        cssPath: string;
        preloadFontPath: string;
        fontType: string;
    };
    lexend: {
        cssPath: string;
        preloadFontPath: string;
        fontType: string;
    };
    jetbrainsMono: {
        cssPath: string;
        preloadFontPath: string;
        fontType: string;
    };
};
declare const defaultTheme: ThemeDefinition<DefaultThemeConfig>;
export default defaultTheme;
export type SearchConfig = {};
export type NavItem = {
    text: string;
    link: string;
    activeMatch?: string;
};
export interface SocialLink {
    type: "discord" | "github" | "opencollective" | "custom";
    link: string;
    logo?: string;
    label?: string;
}

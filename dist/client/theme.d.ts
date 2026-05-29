export type ThemeType = "light" | "dark";
export type RawThemeType = ThemeType | `s${ThemeType}`;
export declare function getRawTheme(): RawThemeType;
export declare function getTheme(): ThemeType;
export declare function getThemeVariant(): ThemeType | "system";
export declare const setTheme: import("solid-js").Setter<ThemeType | "system" | undefined>;
export declare function useThemeListener(): void;

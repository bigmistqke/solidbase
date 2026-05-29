/**
 * Options for the Language switcher plugin.
 */
export interface LanguageSwitcherOptions {
    /**
     * Whether to show the toggle button in the code block header.
     * @default true
     */
    showToggleButton?: boolean;
    /**
     * A function to format the generated JavaScript code.
     * Defaults to formatting with Prettier with default options.
     */
    formatter?: (code: string) => string | Promise<string>;
}
/**
 * Creates an Expressive Code plugin that adds TypeScript/JavaScript toggle functionality.
 *
 * This plugin converts TypeScript/TSX code blocks to their JavaScript/JSX equivalents
 * and renders both versions side-by-side with a toggle button.
 *
 * Supported languages: ts, typescript, tsx.
 * Other languages are not supported and will be ignored by the plugin.
 *
 * @param options - Configuration options for the plugin
 * @returns An Expressive Code plugin
 */
export declare function ecPluginLanguageSwitcher(options: LanguageSwitcherOptions): import("@expressive-code/core").ExpressiveCodePlugin;

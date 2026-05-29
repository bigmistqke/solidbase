import { preloadFonts } from "virtual:solidbase/default-theme/fonts";
export function getFontPreloadLinkAttrs() {
    return preloadFonts.map((font) => ({
        rel: "preload",
        href: font.path,
        as: "font",
        crossorigin: "",
        type: `font/${font.type}`,
    }));
}
//# sourceMappingURL=fonts.js.map
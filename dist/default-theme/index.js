import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { defineTheme } from "../config/index.js";
export { defaultThemeTextConfig } from "./text.js";
const require = createRequire(import.meta.url);
function resolvePackageFile(specifier) {
    return pathToFileURL(require.resolve(specifier)).href;
}
const allFonts = {
    inter: {
        cssPath: resolvePackageFile("@fontsource-variable/inter"),
        preloadFontPath: resolvePackageFile("@fontsource-variable/inter/files/inter-latin-wght-normal.woff2"),
        fontType: "woff2",
    },
    lexend: {
        cssPath: resolvePackageFile("@fontsource-variable/lexend"),
        preloadFontPath: resolvePackageFile("@fontsource-variable/lexend/files/lexend-latin-wght-normal.woff2"),
        fontType: "woff2",
    },
    jetbrainsMono: {
        cssPath: resolvePackageFile("@fontsource-variable/jetbrains-mono"),
        preloadFontPath: resolvePackageFile("@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2"),
        fontType: "woff2",
    },
};
const defaultTheme = defineTheme({
    componentsPath: new URL("./", import.meta.url).href,
    vite(config) {
        const filteredFonts = [];
        if (config?.themeConfig?.fonts !== false) {
            const fonts = config?.themeConfig?.fonts;
            for (const [font, paths] of Object.entries(allFonts)) {
                if (fonts?.[font] !== false)
                    filteredFonts.push(paths);
            }
        }
        return [
            {
                name: "solidbase-default-theme-fonts",
                resolveId(id) {
                    if (id.startsWith("virtual:solidbase/default-theme/fonts.css"))
                        return "\0virtual:solidbase/default-theme/fonts.css";
                    if (id.startsWith("virtual:solidbase/default-theme/fonts"))
                        return "\0virtual:solidbase/default-theme/fonts";
                },
                load(id) {
                    if (id.startsWith("\0virtual:solidbase/default-theme/fonts.css"))
                        return filteredFonts
                            .map((font) => `@import url(${fileURLToPath(font.cssPath, { windows: false })});`)
                            .join("\n");
                    if (id.startsWith("\0virtual:solidbase/default-theme/fonts")) {
                        const preloadFonts = filteredFonts.map((font, i) => {
                            const pathIdent = `font_${i}`;
                            return {
                                pathIdent,
                                import: `import ${pathIdent} from "${fileURLToPath(font.preloadFontPath, { windows: false })}?url";`,
                                type: font.fontType,
                            };
                        });
                        return `
							${preloadFonts.map((f) => f.import).join("\n")}

							export const preloadFonts = [
								${preloadFonts
                            .map((f) => `{ path: ${f.pathIdent}, type: "${f.type}" }`)
                            .join(",")}
							];
						`;
                    }
                },
            },
        ];
    },
});
export default defaultTheme;
//# sourceMappingURL=index.js.map
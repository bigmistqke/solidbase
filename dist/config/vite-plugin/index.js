import { fileURLToPath } from "node:url";
import MagicString from "magic-string";
import AutoImport from "unplugin-auto-import/vite";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import solidBaseLlmsPlugin from "./llms.js";
import solidBaseRobotsPlugin from "./robots.js";
import solidBaseSitemapPlugin from "./sitemap.js";
import { componentsModule, configModule, transformMdxModule, } from "./virtual.js";
export default function solidBaseVitePlugin(theme, solidBaseConfig) {
    let root = process.cwd();
    const plugins = [
        {
            name: "solidbase:pre",
            enforce: "pre",
            config() {
                return { resolve: { noExternal: ["@kobalte/solidbase"] } };
            },
            configResolved(resolvedConfig) {
                root = resolvedConfig.root;
            },
            resolveId(id) {
                if (id === configModule.id)
                    return configModule.resolvedId;
                if (id === componentsModule.id)
                    return componentsModule.resolvedId;
                if (id === "virtual:solidbase/mdx")
                    return "\0virtual:solidbase/mdx";
                if (id.startsWith("\0unfonts.css"))
                    return id.slice("\0".length);
            },
            async load(id) {
                if (id === configModule.resolvedId)
                    return configModule.load(solidBaseConfig, root);
                if (id === componentsModule.resolvedId)
                    return await componentsModule.load(theme);
                if (id === "\0virtual:solidbase/mdx")
                    return `export * from "@kobalte/solidbase/mdx"`;
            },
            transform(code, id) {
                if (isMarkdown(id)) {
                    const s = new MagicString(code);
                    s.replaceAll(/="(\$\$SolidBase_RelativeImport\d+)"/gm, (_, ident) => `={${ident}}`);
                    return {
                        code: s.toString(),
                        map: s.generateMap(),
                    };
                }
            },
        },
        {
            name: "solidbase:post",
            enforce: "post",
            transform(code, id) {
                if (isMarkdown(id))
                    return transformMdxModule(code, id, solidBaseConfig);
            },
        },
    ];
    if (solidBaseConfig.autoImport) {
        const { resolvers: _resolvers, iconResolver, ...autoImport } = solidBaseConfig.autoImport === true ? {} : solidBaseConfig.autoImport;
        const resolvers = [];
        if (_resolvers) {
            if (Array.isArray(_resolvers))
                resolvers.push(..._resolvers.flat());
            else
                resolvers.push(_resolvers);
        }
        if (iconResolver !== false)
            resolvers.push(IconsResolver({
                prefix: "Icon",
                ...iconResolver,
                extension: "jsx",
            }));
        plugins.push(VinxiAutoImport({
            dts: fileURLToPath(new URL("./src/auto-imports.d.ts", import.meta.url)),
            ...autoImport,
            resolvers,
        }));
    }
    if (solidBaseConfig.icons !== false)
        plugins.push(Icons({
            compiler: "solid",
            autoInstall: true,
            ...solidBaseConfig.icons,
        }));
    plugins.push(solidBaseLlmsPlugin(solidBaseConfig));
    plugins.push(solidBaseSitemapPlugin(solidBaseConfig));
    plugins.push(solidBaseRobotsPlugin(solidBaseConfig));
    return plugins;
}
export function isMarkdown(path) {
    return !!path.match(/\.(mdx|md)/gm);
}
function VinxiAutoImport(options) {
    const autoimport = AutoImport(options);
    const transform = typeof autoimport.transform === "function"
        ? autoimport.transform
        : autoimport.transform?.handler;
    const ABSOLUTE_PATH = /^\/|^[a-zA-Z]:\//;
    return {
        ...autoimport,
        transform(src, id) {
            let pathname = id;
            if (ABSOLUTE_PATH.test(id)) {
                pathname = new URL(`file://${id}`).pathname;
            }
            return transform?.call(this, src, pathname);
        },
    };
}
//# sourceMappingURL=index.js.map
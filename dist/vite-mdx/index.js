// ty vinxi :)
import { VFile } from "vfile";
import { mergeArrays } from "./common.js";
import { createTransformer } from "./transform.js";
import { viteMdxTransclusion } from "./viteMdxTransclusion/index.js";
export default function viteMdx(mdxOptions) {
    return createPlugin(mdxOptions || {});
}
viteMdx.withImports = (namedImports) => function mdx(mdxOptions) {
    return createPlugin(mdxOptions || {}, namedImports);
};
function createPlugin(mdxOptions, namedImports) {
    let getMdxOptions;
    let globalMdxOptions = mdxOptions;
    if (typeof mdxOptions === "function") {
        getMdxOptions = mdxOptions;
        globalMdxOptions = {};
    }
    // Ensure plugin arrays exist for other Vite plugins to manipulate.
    globalMdxOptions.remarkPlugins ??= [];
    globalMdxOptions.rehypePlugins ??= [];
    // let reactRefresh: Plugin | undefined;
    let transformMdx;
    const mdxPlugin = {
        name: "vite-plugin-mdx",
        // I can't think of any reason why a plugin would need to run before mdx; let's make sure `vite-plugin-mdx` runs first.
        enforce: "pre",
        mdxOptions: globalMdxOptions,
        configResolved({ root }) {
            // const reactRefreshPlugins = plugins.filter(
            // 	(p) =>
            // 		p.name === "react-refresh" ||
            // 		p.name === "vite:react-babel" ||
            // 		p.name === "vite:react-refresh" ||
            // 		p.name === "vite:react-jsx",
            // );
            // reactRefresh = reactRefreshPlugins.find((p) => p.transform);
            transformMdx = createTransformer(root, namedImports);
        },
        async transform(_code, id, _ssr) {
            let code = _code;
            const [path, _query] = id.split("?");
            if (/\.mdx?$/.test(path)) {
                if (!transformMdx)
                    throw new Error("vite-plugin-mdx: configResolved hook should be called before calling transform hook");
                const mdxOptions = mergeOptions(globalMdxOptions, getMdxOptions?.(path));
                const input = new VFile({ value: code, path });
                code = await transformMdx(input, { ...mdxOptions });
                // const refreshResult = await reactRefresh?.transform?.call(
                // 	this,
                // 	code,
                // 	`${path}.js`,
                // 	ssr,
                // );
                return (
                // refreshResult ||
                {
                    code,
                    map: { mappings: "" },
                });
            }
        },
    };
    return [
        mdxPlugin,
        // Let .mdx files import other .mdx and .md files without an import
        // specifier to automatically inline their content seamlessly.
        viteMdxTransclusion(globalMdxOptions, getMdxOptions),
    ];
}
function mergeOptions(globalOptions, localOptions) {
    return {
        ...globalOptions,
        ...localOptions,
        remarkPlugins: mergeArrays(globalOptions.remarkPlugins, localOptions?.remarkPlugins),
        rehypePlugins: mergeArrays(globalOptions.rehypePlugins, localOptions?.rehypePlugins),
    };
}
//# sourceMappingURL=index.js.map
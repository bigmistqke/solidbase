import type { NamedImports } from "./imports.js";
import type { MdxOptions, MdxPlugin } from "./types.js";
export type { MdxOptions, MdxPlugin };
declare function viteMdx(mdxOptions?: MdxOptions | ((filename: string) => MdxOptions)): import("vite").Plugin<any>[];
declare namespace viteMdx {
    var withImports: (namedImports: NamedImports) => (mdxOptions?: MdxOptions | ((filename: string) => MdxOptions)) => import("vite").Plugin<any>[];
}
export default viteMdx;

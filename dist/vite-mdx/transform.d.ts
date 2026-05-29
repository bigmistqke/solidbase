import type { VFileCompatible } from "vfile";
import type { MdxOptions } from "./types.js";
export declare function createTransformer(root: string, namedImports?: import("./imports.js").NamedImports): (code_mdx: VFileCompatible, mdxOptions?: MdxOptions) => Promise<string>;

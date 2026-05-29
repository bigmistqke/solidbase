import type { Root } from "mdast";
import type { VFile } from "vfile";
import type { Plugin } from "vite";
export interface ImportCodeFileOptions {
    preserveTrailingNewline?: boolean;
    removeRedundantIndentations?: boolean;
    transform?: (code: string, id: string, importer: string) => string | void;
}
export declare function remarkImportCodeFile(options?: ImportCodeFileOptions): (tree: Root, file: VFile) => void;
export declare function viteAliasCodeImports(resolver?: (source: string, importer: string) => Promise<{
    id: string;
} | null>): Plugin;

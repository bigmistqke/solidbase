import type LRUCache from "@alloc/quick-lru";
import type { RootContent } from "mdast";
import type { Processor, Transformer } from "unified";
import type { ImportMap } from "./ImportMap.js";
export type MdxAstCache = LRUCache<string, RootContent[]>;
export declare function remarkTransclusion({ resolve, readFile, getCompiler, importMap, astCache, }: {
    resolve(id: string, importer?: string): Promise<string | undefined>;
    readFile(filePath: string): Promise<string>;
    getCompiler(filePath: string): Processor;
    importMap?: ImportMap;
    astCache?: MdxAstCache;
}): () => Transformer;

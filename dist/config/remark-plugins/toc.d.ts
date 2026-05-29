import { type Options } from "mdast-util-toc";
export declare const SolidBaseTOC = "$$SolidBase_TOC";
export type TOCOptions = {
    minDepth?: Options["minDepth"];
    maxDepth?: Options["maxDepth"];
};
export declare function remarkTOC(opts?: TOCOptions): (tree: any) => void;

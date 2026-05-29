import { fromJs } from "esast-util-from-js";
import { findAndReplace } from "mdast-util-find-and-replace";
import { toString as nodeToString } from "mdast-util-to-string";
import { toc } from "mdast-util-toc";
function mapNode(node) {
    return {
        title: nodeToString(node.children[0].children[0].children),
        href: node.children[0].children[0].url,
        children: (node.children[1]?.children ?? []).map(mapNode),
    };
}
export const SolidBaseTOC = "$$SolidBase_TOC";
export function remarkTOC(opts) {
    return (tree) => {
        const map = toc(tree, {
            ordered: true,
            minDepth: opts?.minDepth ?? 1,
            maxDepth: opts?.maxDepth ?? 4,
            parents: (a) => a.type === "root" || a.type === "mdxJsxFlowElement",
        }).map;
        let value;
        if (!map) {
            value = "undefined";
        }
        else {
            map.data ??= {};
            map.data.hProperties ??= {};
            map.data.hProperties["data-toc"] = "";
            findAndReplace(tree, [["[[toc]]", () => map]]);
            // @ts-expect-error: not sure what the correct type is
            value = JSON.stringify(map.children.map(mapNode));
        }
        tree.children.unshift({
            type: "mdxjsEsm",
            value: "",
            data: {
                estree: fromJs(`const ${SolidBaseTOC} = ${value};`, {
                    module: true,
                }),
            },
        });
    };
}
//# sourceMappingURL=toc.js.map
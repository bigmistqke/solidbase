import { visit } from "unist-util-visit";
export function remarkAddClass() {
    return (tree) => {
        visit(tree, (node) => {
            if (node.type !== "mdxJsxTextElement" || node.name !== "kbd")
                return;
            node.attributes ??= [];
            const found = node.attributes.find((attr) => attr.name === "class");
            if (found) {
                found.value += " sb-kbd";
            }
            else {
                node.attributes.push({
                    type: "mdxJsxAttribute",
                    name: "class",
                    value: "sb-kbd",
                });
            }
        });
    };
}
//# sourceMappingURL=kbd.js.map
import { SKIP, visit } from "unist-util-visit";
export function isInlineFrontmatterExpression(value) {
    return value.startsWith("frontmatter.") || value.startsWith("frontmatter[");
}
export function evaluateInlineFrontmatterExpression(frontmatter, expression) {
    const scopedEval = (scope, script) => Function(`"use strict"; return ${script}`).bind(scope)();
    return scopedEval({ frontmatter }, `this.${expression}`);
}
export function remarkInlineFrontmatter() {
    return (tree) => {
        visit(tree, (node, _index, parent) => {
            if (node.type !== "mdxTextExpression" || parent.type !== "heading")
                return;
            if (!isInlineFrontmatterExpression(node.value))
                return;
            const value = evaluateInlineFrontmatterExpression(tree.data.frontmatter, node.value);
            Object.assign(node, {
                type: "text",
                value,
            });
            return SKIP;
        });
    };
}
//# sourceMappingURL=inline-frontmatter.js.map
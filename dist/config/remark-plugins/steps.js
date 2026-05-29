import { visit } from "unist-util-visit";
const StepRegex = /^(\d+)\.\s(.+)$/;
export function remarkSteps() {
    function convertToSteps(nodes) {
        const depth = nodes[0].depth;
        const children = [];
        for (const node of nodes) {
            if (node.type === "heading" && node.depth === depth) {
                children.push({
                    type: "mdxJsxFlowElement",
                    name: "Step",
                    attributes: [],
                    children: [node],
                });
            }
            else {
                children[children.length - 1].children.push(node);
            }
        }
        return {
            type: "mdxJsxFlowElement",
            name: "Steps",
            attributes: [],
            data: {
                _sb_step: true,
            },
            children,
        };
    }
    return (tree) => {
        visit(tree, (parent) => {
            if (!("children" in parent) || parent.type === "heading")
                return;
            if (parent.data && "_sb_step" in parent.data)
                return "skip";
            let startIdx = -1;
            let lastNumber = 0;
            let i = 0;
            const onEnd = () => {
                if (startIdx === -1)
                    return;
                // range: start index to i - 1
                const item = {};
                const nodes = parent.children.splice(startIdx, i - startIdx, item);
                Object.assign(item, convertToSteps(nodes));
                i = startIdx + 1;
                startIdx = -1;
            };
            for (; i < parent.children.length; i++) {
                const node = parent.children[i];
                if (node.type !== "heading")
                    continue;
                if (startIdx !== -1) {
                    const startDepth = parent.children[startIdx].depth;
                    if (node.depth > startDepth)
                        continue;
                    if (node.depth < startDepth)
                        onEnd();
                }
                const head = node.children.filter((c) => c.type === "text").at(0);
                if (!head) {
                    onEnd();
                    continue;
                }
                const match = StepRegex.exec(head.value);
                if (!match) {
                    onEnd();
                    continue;
                }
                const num = Number(match[1]);
                head.value = match[2];
                if (startIdx !== -1 && num !== lastNumber + 1)
                    onEnd();
                if (startIdx === -1)
                    startIdx = i;
                lastNumber = num;
            }
            onEnd();
        });
    };
}
//# sourceMappingURL=steps.js.map
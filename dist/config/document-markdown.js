import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { SKIP, visit } from "unist-util-visit";
import { VFile } from "vfile";
import { getRemarkPlugins } from "./mdx.js";
import { remarkCodeTabs } from "./remark-plugins/code-tabs.js";
import { evaluateInlineFrontmatterExpression, isInlineFrontmatterExpression, remarkInlineFrontmatter, } from "./remark-plugins/inline-frontmatter.js";
import { remarkAddClass } from "./remark-plugins/kbd.js";
import { remarkPreview } from "./remark-plugins/preview.js";
const DOCUMENT_ONLY_SKIPPED_PLUGINS = new Set([
    remarkCodeTabs,
    remarkPreview,
    remarkAddClass,
]);
function renderExpressionValue(value) {
    if (value === null || value === undefined || typeof value === "boolean") {
        return "";
    }
    if (typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "bigint") {
        return String(value);
    }
    if (Array.isArray(value)) {
        return value
            .map((entry) => renderExpressionValue(entry))
            .filter((entry) => entry !== null)
            .join("");
    }
    return null;
}
function remarkDocumentInlineFrontmatter() {
    return (tree) => {
        visit(tree, (node, index, parent) => {
            if ((node.type !== "mdxTextExpression" &&
                node.type !== "mdxFlowExpression") ||
                index === undefined ||
                parent === undefined ||
                !isInlineFrontmatterExpression(node.value)) {
                return;
            }
            let value;
            try {
                value = evaluateInlineFrontmatterExpression(tree.data.frontmatter, node.value);
            }
            catch {
                return;
            }
            const text = renderExpressionValue(value);
            if (text === null)
                return;
            if (node.type === "mdxTextExpression") {
                parent.children.splice(index, 1, {
                    type: "text",
                    value: text,
                });
                return [SKIP, index];
            }
            if (text === "") {
                parent.children.splice(index, 1);
                return [SKIP, index];
            }
            parent.children.splice(index, 1, {
                type: "paragraph",
                children: [{ type: "text", value: text }],
            });
            return [SKIP, index];
        });
    };
}
function remarkStripDocumentMetadata() {
    return (tree) => {
        visit(tree, (node, index, parent) => {
            if (index === undefined ||
                parent === undefined ||
                (node.type !== "yaml" &&
                    node.type !== "toml" &&
                    node.type !== "mdxjsEsm")) {
                return;
            }
            parent.children.splice(index, 1);
            return [SKIP, index];
        });
    };
}
function getJsxAttributeValue(node, name) {
    return node.attributes?.find((attr) => attr.type === "mdxJsxAttribute" && attr.name === name)?.value;
}
function hasDirectiveTitle(title) {
    return typeof title === "string" && title !== " ";
}
function createDirectiveLabel(label) {
    return {
        type: "paragraph",
        data: {
            directiveLabel: true,
        },
        children: [
            {
                type: "text",
                value: label,
            },
        ],
    };
}
function createDirectiveContainer(name, children, title) {
    return {
        type: "containerDirective",
        name,
        attributes: [],
        children: hasDirectiveTitle(title)
            ? [createDirectiveLabel(title), ...children]
            : children,
    };
}
function normalizeMdxChildren(nodes) {
    return nodes.flatMap((node) => {
        const normalized = normalizeMdxNode(node);
        if (normalized === null)
            return [];
        return Array.isArray(normalized) ? normalized : [normalized];
    });
}
function normalizeDirectiveContainer(node) {
    const type = getJsxAttributeValue(node, "type");
    const title = getJsxAttributeValue(node, "title");
    const rawChildren = node.children ?? [];
    if (type === "tab-group") {
        const tabs = rawChildren.filter((child) => child?.type === "mdxJsxFlowElement" &&
            getJsxAttributeValue(child, "type") === "tab");
        if (title === "package-manager") {
            const codeBlocks = tabs
                .flatMap((child) => normalizeMdxChildren(child.children ?? []))
                .filter((child) => child?.type === "code");
            const lang = codeBlocks[0]?.lang ?? "sh";
            const value = codeBlocks
                .map((child) => child.value)
                .filter((child) => typeof child === "string")
                .join("\n");
            if (value) {
                return [
                    {
                        type: "code",
                        lang,
                        value,
                    },
                ];
            }
        }
    }
    const children = normalizeMdxChildren(rawChildren);
    const label = hasDirectiveTitle(title) ? title : undefined;
    if (type === "tab") {
        return createDirectiveContainer("tab", children, label);
    }
    return typeof type === "string"
        ? createDirectiveContainer(type, children, label)
        : children;
}
function normalizeMdxNode(node) {
    if (node.type === "mdxFlowExpression" || node.type === "mdxTextExpression") {
        return null;
    }
    if (node.type === "mdxJsxTextElement") {
        return node;
    }
    if (node.type === "mdxJsxFlowElement") {
        if (node.name === "DirectiveContainer") {
            return normalizeDirectiveContainer(node);
        }
        if (node.name === "Steps" || node.name === "Step") {
            return normalizeMdxChildren(node.children ?? []);
        }
        return node;
    }
    if (Array.isArray(node.children)) {
        return {
            ...node,
            children: normalizeMdxChildren(node.children),
        };
    }
    return node;
}
function remarkNormalizeMdxToMarkdown() {
    return (tree) => {
        tree.children = normalizeMdxChildren(tree.children ?? []);
    };
}
function getPluginIdentity(plugin) {
    return Array.isArray(plugin) ? plugin[0] : plugin;
}
function isDocumentOnlySkippedPlugin(plugin) {
    return DOCUMENT_ONLY_SKIPPED_PLUGINS.has(getPluginIdentity(plugin));
}
function getDocumentRemarkPlugins(config = {}) {
    return getRemarkPlugins(config)
        .filter((plugin) => !isDocumentOnlySkippedPlugin(plugin))
        .map((plugin) => plugin === remarkInlineFrontmatter
        ? remarkDocumentInlineFrontmatter
        : plugin);
}
export async function toDocumentMarkdown(source, options = {}) {
    const processor = unified()
        .use(remarkParse)
        .use(remarkMdx)
        .use(getDocumentRemarkPlugins(options.config))
        .use(remarkStripDocumentMetadata)
        .use(remarkNormalizeMdxToMarkdown)
        .use(remarkStringify);
    const file = await processor.process(new VFile({ path: options.filePath, value: source }));
    return String(file).trim();
}
//# sourceMappingURL=document-markdown.js.map
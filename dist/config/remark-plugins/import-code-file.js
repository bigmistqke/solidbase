// Adapted from https://github.com/kevin940726/remark-code-import MIT
import fs from "node:fs";
import path from "node:path";
import { MetaOptions } from "@expressive-code/core";
import { visit } from "unist-util-visit";
import { isMarkdown } from "../vite-plugin/index.js";
function extractLines(content, fromLine, hasDash, toLine, preserveTrailingNewline = false) {
    const lines = content.split(/\r\n|\n|\r/);
    const start = fromLine || 1;
    let end;
    if (!hasDash) {
        end = start;
    }
    else if (toLine) {
        end = toLine;
    }
    else if (lines[lines.length - 1] === "" && !preserveTrailingNewline) {
        end = lines.length - 1;
    }
    else {
        end = lines.length;
    }
    return lines.slice(start - 1, end).join("\n");
}
export function remarkImportCodeFile(options = {}) {
    return function transformer(tree, file) {
        visit(tree, (node) => {
            if (node.type !== "code")
                return;
            const nodeLangMeta = new MetaOptions(node.lang ?? "");
            const langFile = nodeLangMeta.getString("file");
            const nodeMeta = new MetaOptions(node.meta ?? "");
            const fileMeta = nodeMeta.getString("file");
            const attr = langFile ?? fileMeta;
            if (!attr) {
                return;
            }
            if (!file.dirname) {
                throw new Error('"file" should be an instance of VFile');
            }
            const res = /^(?<path>.+?)(?:(?:#(?:L(?<from>\d+)(?<dash>-)?)?)(?:L(?<to>\d+))?)?$/.exec(attr);
            if (!res || !res.groups || !res.groups.path) {
                throw new Error(`Unable to parse file path ${attr}`);
            }
            const filePath = res.groups.path;
            const fromLine = res.groups.from
                ? Number.parseInt(res.groups.from, 10)
                : undefined;
            const hasDash = !!res.groups.dash || fromLine === undefined;
            const toLine = res.groups.to
                ? Number.parseInt(res.groups.to, 10)
                : undefined;
            const resolvedFilePath = path.resolve(file.dirname, filePath);
            const filename = path.basename(filePath);
            const fileExt = filename.split(".").slice(-1)[0];
            if (langFile)
                node.lang = fileExt;
            node.meta = `title="${filename}" ${node.meta ?? ""}`;
            let fileContent = fs.readFileSync(resolvedFilePath, "utf8");
            const transformResult = options.transform?.(fileContent, resolvedFilePath, file.path);
            if (transformResult !== undefined)
                fileContent = transformResult;
            node.value = extractLines(fileContent, fromLine, hasDash, toLine, options.preserveTrailingNewline);
            if (options.removeRedundantIndentations !== false)
                node.value = stripIndent(node.value);
        });
    };
}
export function viteAliasCodeImports(resolver) {
    return {
        name: "solidbase:vite-alias-code-imports",
        enforce: "pre",
        async transform(code, id) {
            if (isMarkdown(id)) {
                const lines = code.split("\n");
                let isDirty = false;
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    if (!line.startsWith("```"))
                        continue;
                    const meta = new MetaOptions(line.slice(3));
                    const file = meta.getString("file");
                    if (!file)
                        continue;
                    const resolved = await (resolver
                        ? resolver(file, id)
                        : this.resolve(file, id));
                    if (!resolved)
                        continue;
                    lines[i] = line.replace(file, resolved.id);
                    isDirty = true;
                }
                if (isDirty)
                    return lines.join("\n");
            }
        },
    };
}
// Adapted from https://github.com/jamiebuilds/min-indent MIT
function minIndent(str) {
    const match = str.match(/^[ \t]*(?=\S)/gm);
    if (!match) {
        return 0;
    }
    return match.reduce((r, a) => Math.min(r, a.length), Number.POSITIVE_INFINITY);
}
// Adapted from https://github.com/sindresorhus/strip-indent MIT
function stripIndent(str) {
    const indent = minIndent(str);
    if (indent === 0) {
        return str;
    }
    const regex = new RegExp(`^[ \\t]{${indent}}`, "gm");
    return str.replace(regex, "");
}
//# sourceMappingURL=import-code-file.js.map
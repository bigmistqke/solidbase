// https://github.com/remcohaszing/remark-mdx-frontmatter MIT
import { valueToEstree } from "estree-util-value-to-estree";
import { parse as parseToml } from "toml";
import { define } from "unist-util-mdx-define";
import { parse as parseYaml } from "yaml";
/**
 * A remark plugin to expose frontmatter data as named exports.
 *
 * @param options Optional options to configure the output.
 * @returns A unified transformer.
 */
export const remarkMdxFrontmatter = ({ name = "frontmatter", parsers, ...options } = {}) => {
    const allParsers = {
        yaml: parseYaml,
        toml: parseToml,
        ...parsers,
    };
    return (ast, file) => {
        let data = {};
        const node = ast.children.find((child) => Object.hasOwn(allParsers, child.type));
        if (node) {
            const parser = allParsers[node.type];
            const { value } = node;
            data = parser(value);
        }
        const variables = {
            [name]: valueToEstree(data, { preserveReferences: true }),
        };
        define(ast, file, variables, options);
        ast.data ??= {};
        ast.data.frontmatter = data;
    };
};
//# sourceMappingURL=mdx-frontmatter.js.map
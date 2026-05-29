import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { nodeTypes } from "@mdx-js/mdx";
import ecTwoSlash from "expressive-code-twoslash";
import rehypeAutoLinkHeadings from "rehype-autolink-headings";
import rehypeExpressiveCode from "rehype-expressive-code";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { convertCompilerOptionsFromJson } from "typescript";
import mdx from "../vite-mdx/index.js";
import { ecPluginLanguageSwitcher, } from "./ec-plugins/language-switcher/index.js";
import { rehypeFixExpressiveCodeJsx } from "./rehype-plugins/fix-expressive-code.js";
import { remarkCodeTabs } from "./remark-plugins/code-tabs.js";
import { remarkDirectiveContainers } from "./remark-plugins/directives.js";
import { remarkGithubAlertsToDirectives } from "./remark-plugins/gh-directives.js";
import { remarkImportCodeFile, viteAliasCodeImports, } from "./remark-plugins/import-code-file.js";
import { remarkInlineFrontmatter } from "./remark-plugins/inline-frontmatter.js";
import { remarkIssueAutolink } from "./remark-plugins/issue-autolink.js";
import { remarkAddClass } from "./remark-plugins/kbd.js";
import { remarkMdxFrontmatter } from "./remark-plugins/mdx-frontmatter.js";
import { remarkPackageManagerTabs } from "./remark-plugins/package-manager-tabs.js";
import { remarkPreview } from "./remark-plugins/preview.js";
import { remarkRelativeImports } from "./remark-plugins/relative-imports.js";
import { remarkSteps } from "./remark-plugins/steps.js";
import { remarkTabGroup } from "./remark-plugins/tab-group.js";
import { remarkTOC } from "./remark-plugins/toc.js";
export function solidBaseMdx(sbConfig) {
    return [
        viteAliasCodeImports(),
        mdx.withImports({})({
            jsx: true,
            jsxImportSource: "solid-js",
            providerImportSource: "@kobalte/solidbase/mdx",
            stylePropertyNameCase: "css",
            rehypePlugins: getRehypePlugins(sbConfig),
            remarkPlugins: getRemarkPlugins(sbConfig),
        }),
    ];
}
function getRehypePlugins(sbConfig) {
    const rehypePlugins = [];
    if (sbConfig.markdown?.expressiveCode !== false) {
        const plugins = [
            pluginLineNumbers(),
            pluginCollapsibleSections(),
        ];
        if (sbConfig.markdown?.expressiveCode?.twoSlash) {
            const twoSlash = sbConfig.markdown.expressiveCode.twoSlash === true
                ? {}
                : sbConfig.markdown.expressiveCode.twoSlash;
            plugins.push(ecTwoSlash({
                ...twoSlash,
                twoslashOptions: {
                    ...twoSlash.twoslashOptions,
                    compilerOptions: {
                        ...convertCompilerOptionsFromJson({
                            allowSyntheticDefaultImports: true,
                            esModuleInterop: true,
                            target: "ESNext",
                            module: "ESNext",
                            lib: ["dom", "esnext"],
                            jsxImportSource: "solid-js",
                            jsx: "preserve",
                            ...twoSlash.tsconfig,
                        }, ".").options,
                        ...twoSlash.twoslashOptions?.compilerOptions,
                    },
                },
            }));
        }
        if (sbConfig.markdown?.expressiveCode?.languageSwitcher) {
            const config = sbConfig.markdown.expressiveCode.languageSwitcher === true
                ? { showToggleButton: true }
                : {
                    showToggleButton: true,
                    ...sbConfig.markdown.expressiveCode?.languageSwitcher,
                };
            plugins.push(ecPluginLanguageSwitcher(config));
        }
        rehypePlugins.push([
            rehypeExpressiveCode,
            {
                themes: ["github-dark", "github-light"],
                themeCssSelector: (theme) => `[data-theme*="${theme.type}"]`,
                plugins,
                defaultProps: {
                    showLineNumbers: false,
                    collapseStyle: "collapsible-auto",
                },
                ...sbConfig.markdown?.expressiveCode,
            },
        ], rehypeFixExpressiveCodeJsx);
    }
    rehypePlugins.push([rehypeRaw, { passThrough: nodeTypes }], rehypeSlug, [
        rehypeAutoLinkHeadings,
        {
            behavior: "wrap",
            properties: {
                "data-auto-heading": "",
            },
        },
    ], ...(sbConfig.markdown?.rehypePlugins ?? []));
    return rehypePlugins;
}
export function getRemarkPlugins(sbConfig) {
    const remarkPlugins = [];
    if (sbConfig.markdown?.steps !== false)
        remarkPlugins.push(remarkSteps);
    const expressiveCodeConfig = sbConfig.markdown?.expressiveCode;
    const languageSwitcherConfig = expressiveCodeConfig
        ? expressiveCodeConfig.languageSwitcher
        : {};
    const isLanguageSwitcherDisabled = !languageSwitcherConfig ||
        (languageSwitcherConfig !== true &&
            !(languageSwitcherConfig.showToggleButton ?? true));
    const withTsJsToggle = !!expressiveCodeConfig && !isLanguageSwitcherDisabled;
    remarkPlugins.push(remarkFrontmatter, remarkMdxFrontmatter, remarkInlineFrontmatter, [remarkImportCodeFile, sbConfig.markdown?.importCodeFile], remarkGfm, remarkGithubAlertsToDirectives, [
        remarkCodeTabs,
        {
            withTsJsToggle,
        },
    ], [remarkPackageManagerTabs, sbConfig.markdown?.packageManagers ?? {}], remarkTabGroup, remarkDirective, remarkRelativeImports);
    if (sbConfig.markdown?.toc !== false)
        remarkPlugins.push([remarkTOC, sbConfig.markdown?.toc]);
    remarkPlugins.push(remarkPreview, remarkDirectiveContainers, remarkAddClass);
    if (sbConfig.issueAutolink !== false)
        remarkPlugins.push([remarkIssueAutolink, sbConfig.issueAutolink]);
    remarkPlugins.push(...(sbConfig.markdown?.remarkPlugins ?? []));
    return remarkPlugins;
}
//# sourceMappingURL=mdx.js.map
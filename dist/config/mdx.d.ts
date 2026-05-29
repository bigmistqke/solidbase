import type { PluginTwoslashOptions } from "expressive-code-twoslash";
import { type RehypeExpressiveCodeOptions } from "rehype-expressive-code";
import type { PluggableList } from "unified";
import type { PluginOption } from "vite";
import { type LanguageSwitcherOptions } from "./ec-plugins/language-switcher/index.js";
import type { SolidBaseConfig, SolidBaseResolvedConfig } from "./index.js";
export type RemarkPipelineConfig = Pick<SolidBaseConfig<any>, "markdown" | "issueAutolink">;
import { type ImportCodeFileOptions } from "./remark-plugins/import-code-file.js";
import type { PackageManagerConfig } from "./remark-plugins/package-manager-tabs.js";
import type { TOCOptions } from "./remark-plugins/toc.js";
export type TwoslashOptions = PluginTwoslashOptions & {
    tsconfig: any;
};
export interface MdxOptions {
    expressiveCode?: (RehypeExpressiveCodeOptions & {
        twoSlash?: TwoslashOptions | boolean;
        languageSwitcher?: LanguageSwitcherOptions | boolean;
    }) | false;
    toc?: TOCOptions | false;
    remarkPlugins?: PluggableList;
    rehypePlugins?: PluggableList;
    packageManagers?: PackageManagerConfig | false;
    importCodeFile?: ImportCodeFileOptions | false;
    steps?: false;
}
export declare function solidBaseMdx(sbConfig: SolidBaseResolvedConfig<any>): PluginOption;
export declare function getRemarkPlugins(sbConfig: RemarkPipelineConfig): any[];

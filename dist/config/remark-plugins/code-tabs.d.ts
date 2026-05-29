import type { Root } from "mdast";
import type { Transformer } from "unified";
export interface CodeTabsOptions {
    withTsJsToggle?: boolean;
}
export declare function remarkCodeTabs(options: CodeTabsOptions): Transformer<Root, Root>;

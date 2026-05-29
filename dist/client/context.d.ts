import { type Accessor } from "solid-js";
import type { SolidBaseResolvedConfig } from "../config/index.js";
export interface SolidBaseContextValue<ThemeConfig> {
    config: Accessor<SolidBaseResolvedConfig<ThemeConfig>>;
    metaTitle: Accessor<string>;
}
export declare const SolidBaseContext: import("solid-js").Context<SolidBaseContextValue<any> | undefined>;
export declare function useSolidBaseContext<ThemeConfig>(): SolidBaseContextValue<ThemeConfig>;

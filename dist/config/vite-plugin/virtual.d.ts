import type { SolidBaseConfig, Theme } from "../index.js";
type VirtualModule<T = void> = {
    id: string;
    resolvedId: string;
    load(arg: T, root?: string): Promise<string>;
};
export declare const configModule: VirtualModule<Partial<SolidBaseConfig<any>>>;
export declare const componentsModule: VirtualModule<Theme<any>>;
export declare function transformMdxModule(code: string, id: string, solidBaseConfig: Partial<SolidBaseConfig<any>>): Promise<string>;
export {};

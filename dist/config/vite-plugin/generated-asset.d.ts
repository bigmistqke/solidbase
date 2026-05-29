import type { PluginOption } from "vite";
type GeneratedAssetPluginOptions = {
    name: string;
    apply?: "serve" | "build";
    assetDir: string;
    write(root: string, resolver: (source: string, importer: string) => Promise<{
        id: string;
    } | null>): Promise<void>;
};
export declare function emptyDir(dir: string): Promise<void>;
export declare function createGeneratedAssetPlugin(options: GeneratedAssetPluginOptions): PluginOption;
export {};

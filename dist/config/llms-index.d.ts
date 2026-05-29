import type { SolidBaseResolvedConfig } from "./index.js";
export type LlmDocument = {
    title: string;
    description?: string;
    routePath: string;
    markdownPath: string;
    content: string;
};
export declare function getLlmDocuments(root: string, config: SolidBaseResolvedConfig<any>, resolver: (source: string, importer: string) => Promise<{
    id: string;
} | null>): Promise<LlmDocument[]>;
export declare function buildLlmsIndex(origin: string | undefined, config: SolidBaseResolvedConfig<any>, documents: LlmDocument[]): string;
export declare function getDocumentByPath(documents: LlmDocument[], pathname: string): LlmDocument | undefined;

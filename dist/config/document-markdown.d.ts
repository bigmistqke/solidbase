import type { RemarkPipelineConfig } from "./mdx.js";
type DocumentMarkdownOptions = {
    config?: RemarkPipelineConfig;
    filePath?: string;
};
export declare function toDocumentMarkdown(source: string, options?: DocumentMarkdownOptions): Promise<string>;
export {};

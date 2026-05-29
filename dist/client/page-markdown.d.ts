import { type ClipboardSetter } from "@solid-primitives/clipboard";
import { type BaseFrontmatter } from "./page-data.js";
export type CopyPageState = "idle" | "success" | "error";
export declare function canCopyPageMarkdown(configLlms: boolean | undefined, llms: BaseFrontmatter["llms"]): boolean;
export declare function toMarkdownPath(pathname: string): string;
export declare function getCurrentPageMarkdownPath(pathname?: string): string | undefined;
export declare function getCurrentPageMarkdown(pathname?: string, fetchImpl?: typeof fetch): Promise<string>;
export declare function copyTextToClipboard(text: string, writeText?: ClipboardSetter): Promise<void>;
export declare function clearPageMarkdownCache(): void;
export declare function useCopyPageMarkdown(): {
    canCopy: () => boolean;
    copy: () => Promise<boolean>;
    isCopying: import("solid-js").Accessor<boolean>;
    isReady: () => boolean;
    state: import("solid-js").Accessor<CopyPageState>;
};

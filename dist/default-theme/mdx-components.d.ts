import { type ComponentProps, type ParentProps } from "solid-js";
import { Preview, PreviewPanel, PreviewStage } from "./components/Preview.js";
export declare function h1(props: ComponentProps<"h1">): import("solid-js").JSX.Element;
export declare function h2(props: ComponentProps<"h2">): import("solid-js").JSX.Element;
export declare function h3(props: ComponentProps<"h3">): import("solid-js").JSX.Element;
export declare function h4(props: ComponentProps<"h4">): import("solid-js").JSX.Element;
export declare function h5(props: ComponentProps<"h5">): import("solid-js").JSX.Element;
export declare function h6(props: ComponentProps<"h6">): import("solid-js").JSX.Element;
export declare function a(props: ComponentProps<"a"> & {
    "data-auto-heading"?: "";
}): import("solid-js").JSX.Element;
export declare function code(props: ComponentProps<"code">): import("solid-js").JSX.Element;
export declare function hr(props: ComponentProps<"hr">): import("solid-js").JSX.Element;
export declare function table(props: ComponentProps<"table">): import("solid-js").JSX.Element;
export declare function blockquote(props: ComponentProps<"blockquote">): import("solid-js").JSX.Element;
export declare function p(props: ComponentProps<"p">): import("solid-js").JSX.Element;
export declare function li(props: ComponentProps<"li">): import("solid-js").JSX.Element;
export declare function ul(props: ComponentProps<"ul">): import("solid-js").JSX.Element;
export declare function ol(props: ComponentProps<"ol">): import("solid-js").JSX.Element;
export declare function DirectiveContainer(props: {
    type: "info" | "note" | "tip" | "important" | "warning" | "danger" | "caution" | "details" | "tab-group" | "tab";
    title?: string;
    codeGroup?: string;
    tabNames?: string;
    withTsJsToggle?: string;
} & ParentProps): import("solid-js").JSX.Element;
export { Preview, PreviewPanel, PreviewStage };
export declare function Steps(props: ParentProps): import("solid-js").JSX.Element;
export declare function Step(props: ParentProps): import("solid-js").JSX.Element;

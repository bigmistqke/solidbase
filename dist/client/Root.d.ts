import { type ParentProps } from "solid-js";
export declare function SolidBaseRoot(props: ParentProps & {
    currentPageData?: {
        deferStream?: boolean;
    };
    meta?: {
        provider?: boolean;
    };
}): import("solid-js").JSX.Element;
export declare function Inner(props: ParentProps): import("solid-js").JSX.Element;

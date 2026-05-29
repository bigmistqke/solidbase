import { type JSX, type ParentProps } from "solid-js";
export declare const MDXContext: import("solid-js").Context<{
    [k: string]: (_props: any) => JSX.Element;
}>;
export declare const MDXProvider: (props: ParentProps<{
    components: {
        [k: string]: (props: any) => JSX.Element;
    };
}>) => JSX.Element;
export declare const useMDXComponents: () => {
    [k: string]: (_props: any) => JSX.Element;
};

import { type Accessor } from "solid-js";
export interface TabsComponentProps {
    tabNames?: string[];
    tabChildren: any[];
    title?: string;
    withTsJsToggle?: boolean;
    value?: Accessor<string>;
    onChange?: (s: string) => void;
}
export declare function TabsComponent(props: TabsComponentProps): import("solid-js").JSX.Element;
export declare function TabsWithPersistence(props: Omit<TabsComponentProps, 'value' | 'onChange'>): import("solid-js").JSX.Element;

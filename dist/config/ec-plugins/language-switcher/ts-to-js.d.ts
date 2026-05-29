export type MarkerType = "mark" | "ins" | "del";
export type Marker = {
    type: MarkerType;
    lines: Array<number>;
    label?: string;
};
export declare const MarkerTypeOrder: Array<MarkerType>;
export declare function tsToJs(tsCode: string, tsMarkers: Array<Marker>, isJsx?: boolean, formatter?: (jsCode: string, isJsx?: boolean) => string | Promise<string>): Promise<{
    jsCode: string;
    markers: Array<Marker>;
}>;

export interface PackageManagerConfig {
    show?: string[];
    default?: string;
    lang?: string;
    presets?: {
        [key: string]: {
            [key: string]: string;
        };
    };
}
export declare function remarkPackageManagerTabs(packageManagers: PackageManagerConfig | false): (tree: any) => void;

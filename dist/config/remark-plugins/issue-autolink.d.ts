export type IssueAutoLinkConfig = string | ((issue: string) => string);
export declare function remarkIssueAutolink(issueAutolink: IssueAutoLinkConfig): (tree: any) => void;

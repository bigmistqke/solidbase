import { findAndReplace } from "mdast-util-find-and-replace";
import { u } from "unist-builder";
export function remarkIssueAutolink(issueAutolink) {
    const url = (issue) => {
        const number = issue.slice(1);
        if (typeof issueAutolink === "function")
            return issueAutolink(number);
        return issueAutolink.replace(":issue", number);
    };
    return (tree) => {
        findAndReplace(tree, [
            [
                /(?<=(^| ))#\d+/gm,
                (match) => {
                    return u("link", { url: url(match) }, [u("text", match)]);
                },
            ],
            [
                /\\#\d+/g,
                (match) => {
                    return match.slice(1);
                },
            ],
        ]);
    };
}
//# sourceMappingURL=issue-autolink.js.map
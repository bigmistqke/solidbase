import { MetaOptions } from "@expressive-code/core";
import type { Root } from "mdast";
import type { Transformer } from "unified";
import { SKIP, visit } from "unist-util-visit";

export interface CodeTabsOptions {
	withTsJsToggle?: boolean;
}

export function remarkCodeTabs(
	options: CodeTabsOptions,
): Transformer<Root, Root> {
	return (tree) => {
		visit(tree, "code", (node, index, parent) => {
			if (parent && parent.type !== "containerDirective") {
				const nodeMeta = new MetaOptions(node.meta ?? "");

				const key = nodeMeta.getString("tab");
				const isRepl = nodeMeta.getBoolean("repl");

				if (!nodeMeta.getBoolean("tab") && !key) return;

				const groupNodes = [node];

				const groupTitles: string[] = [];
				groupTitles.push(
					nodeMeta.getString("title") ?? groupTitles.length.toString(),
				);

				for (let i = index! + 1; i < parent.children.length; i++) {
					const node = parent.children[i] as any;
					const nodeMeta = new MetaOptions(node.meta ?? "");

					const nodeTitle =
						nodeMeta.getString("title") ?? groupTitles.length.toString();
					const nodeIsRepl = nodeMeta.getBoolean("repl");

					if (
						node.type === "code" &&
						(key
							? nodeMeta.getString("tab") === key
							: nodeMeta.getBoolean("tab") && !nodeMeta.getString("tab")) &&
						!groupTitles.includes(nodeTitle) &&
						nodeIsRepl === isRepl
					) {
						groupNodes.push(node);
						groupTitles.push(nodeTitle);
					} else break;
				}

				parent.children[index!] = {
					type: "containerDirective",
					name: "tab-group",
					children: groupNodes.map((node) => {
						const nodeMeta = new MetaOptions(node.meta ?? "");

						// Create a copy of the node with modified meta instead of mutating the original
						const nodeWithFrame = {
							...node,
							meta: `${node.meta ?? ""} frame="none"`,
						};

						return {
							type: "containerDirective",
							name: "tab",
							attributes: {
								isRepl: String(nodeMeta.getBoolean("repl")),
							},
							children: [
								{
									children: [
										{
											type: "text",
											value: nodeMeta.getString("title"),
										},
									],
									data: {
										directiveLabel: true,
									},
								} as any,
								nodeWithFrame,
							],
						};
					}),

					attributes: {
						codeGroup: "true",
						title: key,
						tabNames: groupTitles.join("\0"),
						withTsJsToggle: String(!!options.withTsJsToggle),
						hasRepl: String(
							new MetaOptions(groupNodes[0].meta ?? "").getBoolean("repl"),
						),
						main: (() => {
							const nodeWithMain = groupNodes.find((node) =>
								new MetaOptions(node.meta ?? "").getString("main"),
							);
							return nodeWithMain
								? new MetaOptions(nodeWithMain.meta ?? "").getString("main")
								: undefined;
						})(),
					},
				};

				parent.children.splice(index! + 1, groupNodes.length - 1);
				return [SKIP, index! + groupNodes.length - 1];
			}
		});
	};
}

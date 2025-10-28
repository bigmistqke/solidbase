import {
	PathUtils,
	createFileUrl,
	createFileUrlSystem,
	transformModulePaths,
} from "@bigmistqke/repl";
import { Tabs } from "@kobalte/core";
import { clientOnly } from "@solidjs/start";
import {
	For,
	type JSXElement,
	type ParentProps,
	Show,
	createMemo,
	createSignal,
	onMount,
} from "solid-js";
import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";
import ts from "typescript";
import { usePreferredLanguage } from "../../client";
import styles from "../mdx-components.module.css";
import type { TabsComponentProps } from "./TabsComponent";

export interface ReplWrapperProps extends ParentProps<TabsComponentProps> {
	main: string;
}

const ReplTextArea = clientOnly(() => import("./ReplTextArea"));

function getContentFromChild(child: any) {
	if (typeof child === "string") {
		return child;
	}

	if (globalThis.HTMLElement && child instanceof globalThis.HTMLElement) {
		return Array.from(
			child.querySelector(".frame")?.querySelectorAll(".ec-line") ?? [],
		).reduce(
			(acc, line) =>
				`${acc}\n${
					line instanceof globalThis.HTMLElement ? line.textContent : ""
				}`,
			"",
		);
	}

	return "";
}

export function ReplWrapper(props: ReplWrapperProps) {
	const [virtualFs, setVirtualFs] = createStore(
		Object.fromEntries(
			(props.tabNames ?? []).map((tabName, index) => {
				const content = getContentFromChild(props.tabChildren[index]);
				return [tabName, content] as const;
			}),
		),
	);

	const fileUrls = createClientOnlyMemo(() =>
		createFileUrlSystem({
			readFile: (path) => virtualFs[path],
			extensions: {
				js: {
					type: "javascript",
					transform({ source, path: parentPath, fileUrls }) {
						return transformModulePaths({
							ts,
							source,
							transform(path) {
								if (path.startsWith(".")) {
									return (
										fileUrls.get(
											`./${PathUtils.resolvePath(parentPath, path)}`,
										) ?? ""
									);
								}
								if (path.startsWith("http")) {
									return path;
								}
								return `https://esm.sh/${path}`;
							},
						});
					},
				},
			},
		}),
	);

	return (
		<div class={styles["repl-wrapper"]}>
			<TabsComponent {...props}>
				{(tab, tabName) => (
					<Show when={!isServer} fallback={<div>{tab}</div>}>
						<ReplTextArea
							value={getContentFromChild(tab)}
							onInput={(event) => {
								setVirtualFs(tabName, event.currentTarget.value);
							}}
						/>
					</Show>
				)}
			</TabsComponent>
			{/* REPL iframe on the right */}
			<div class={styles["repl-iframe-container"]}>
				<iframe
					src={createFileUrl(
						`<script type="module" src="${fileUrls()?.get(props.main)}"></script>`,
						"html",
					)}
					class={styles["repl-iframe"]}
					title="REPL Output"
				/>
			</div>
		</div>
	);
}

function createClientOnlyMemo<T>(cb: () => T) {
	const [isClient, setIsClient] = createSignal(false);
	onMount(() => setIsClient(true));
	return createMemo(() => (isClient() ? cb() : undefined));
}

export function TabsComponent(
	props: TabsComponentProps & {
		children: (tab: any, tabName: string) => JSXElement;
	},
) {
	const [preferredLanguage] = usePreferredLanguage();

	return (
		<Tabs.Root
			value={props.value?.()}
			onChange={props.onChange}
			class={styles["tabs-container"]}
		>
			<Tabs.List class={styles["tabs-list"]}>
				{props.tabNames?.map((title) => {
					const jsTitle = title.replace(/\.tsx?$/, (ext) => {
						if (ext === ".tsx") {
							return ".jsx";
						}
						if (ext === ".ts") {
							return ".js";
						}
						return ext;
					});

					return (
						<Tabs.Trigger class={styles["tabs-trigger"]} value={title}>
							{preferredLanguage() === "ts" ? title : jsTitle}
						</Tabs.Trigger>
					);
				})}
				{props.withTsJsToggle && (
					<input
						type="checkbox"
						checked
						title="Toggle language"
						aria-label="Toggle TS/JS"
						class="sb-ts-js-toggle"
					/>
				)}
			</Tabs.List>

			<For each={props.tabNames}>
				{(title, i) => (
					<Tabs.Content
						value={title}
						forceMount={true}
						class={styles["tabs-content"]}
					>
						{props.children(
							props.tabChildren[i()],
							props.tabNames?.[i()] ?? "",
						)}
					</Tabs.Content>
				)}
			</For>
		</Tabs.Root>
	);
}

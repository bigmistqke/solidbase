import {
	type Extension,
	PathUtils,
	createFileUrl,
	createFileUrlSystem,
	transformModulePaths,
} from "@bigmistqke/repl";
import { clientOnly } from "@solidjs/start";
import {
	type ParentProps,
	Show,
	Suspense,
	children,
	createContext,
	createMemo,
	createSignal,
	onMount,
	useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import ts from "typescript";
import { usePreferredLanguage } from "../../client";
import styles from "../mdx-components.module.css";
import { TabsComponent, type TabsComponentProps } from "./TabsComponent";

export interface ReplWrapperProps extends ParentProps<TabsComponentProps> {
	main: string;
}

const ReplTextArea = clientOnly(() => import("./ReplTextArea"));

function getTabPropsFromChildren(container: any) {
	if (!globalThis.HTMLElement) return { tabPanels: [], tabNames: [] };

	const tabpanels = Array.from(
		container.querySelectorAll("[role='tabpanel']") ?? [],
	);
	const tabs = Array.from(container.querySelectorAll("[role='tab']") ?? []);

	return {
		tabNames: tabs.map((tab) => tab.textContent),
		tabChildren: tabs.map((tab) => tab.textContent),
	};
}

function getContentFromChildren(container: any) {
	if (!globalThis.HTMLElement) return {};

	const tabpanels = container.querySelectorAll("[role='tabpanel']") ?? [];
	const tabs = container.querySelectorAll("[role='tab']") ?? [];

	return Object.fromEntries(
		Array.from(tabpanels).map((tabpanel, index) => {
			const name = tabs[index]!.textContent;

			if (tabpanel instanceof globalThis.HTMLElement) {
				return [
					name,
					Array.from(
						tabpanel.querySelector(".frame")?.querySelectorAll(".ec-line") ??
							[],
					).reduce(
						(acc, line) =>
							`${acc}\n${
								line instanceof globalThis.HTMLElement ? line.textContent : ""
							}`,
						"",
					),
				] as const;
			}

			return [name, ""] as const;
		}),
	);
}

export function ReplBlock(props: ReplWrapperProps) {
	const c = children(() => props.children);

	const extensions = useContext(ReplContext);

	const [virtualFs, setVirtualFs] = createStore<Record<string, string>>({});

	const [preferredLanguage] = usePreferredLanguage();

	const [isMount, setIsMount] = createSignal(false);

	onMount(() => {
		const content = getContentFromChildren(c());
		setVirtualFs(content);

		setTimeout(() => setIsMount(true), 1000);
		//setIsMount(true);
	});

	const fileUrls = createClientOnlyMemo(() =>
		createFileUrlSystem({
			readFile: (path) => virtualFs[path] ?? "",
			extensions: extensions ?? {
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
			<Show
				when={!isMount()}
				fallback={
					<TabsComponent
						tabChildren={Object.values(virtualFs)}
						tabNames={Object.keys(virtualFs)}
					>
						{(tab, title) => (
							<Suspense>
								<tm-textarea
									value={tab()}
									onInput={(event) => {
										setVirtualFs(title, event.currentTarget.value);
									}}
								/>
							</Suspense>
						)}
					</TabsComponent>
				}
			>
				{c()}
			</Show>
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

export const ReplContext = createContext<Record<string, Extension>>();

export const ReplProvider = ReplContext.Provider;

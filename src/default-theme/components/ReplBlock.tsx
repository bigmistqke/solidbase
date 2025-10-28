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
	Suspense,
	children,
	createContext,
	createMemo,
	createSignal,
	onMount,
	useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { render } from "solid-js/web";
import ts from "typescript";
import styles from "../mdx-components.module.css";

export interface ReplWrapperProps extends ParentProps {
	main: string;
}

const TmTextarea = clientOnly(() => import("./ReplTextArea"));

const isHTMLElement = (value: any): value is HTMLElement =>
	globalThis.HTMLElement && value instanceof globalThis.HTMLElement;

function extractContentFromHTML(container: HTMLElement) {
	const frames = container.querySelectorAll(".frame") ?? [];
	const tabs = container.querySelectorAll("[role='tab']") ?? [];
	const tabNames = Array.from(tabs).map((tab) => tab.textContent);

	return {
		frames,
		tabNames,
		content: Object.fromEntries(
			Array.from(frames).map((frame, index) => {
				const name = tabNames[index];

				if (!isHTMLElement(frame)) {
					return [name, ""];
				}
				const lines = frame.querySelectorAll(".ec-line");

				if (!lines) {
					return [name, ""];
				}

				return [
					name,
					Array.from(lines).reduce(
						(acc, line) =>
							`${acc}\n${isHTMLElement(line) ? line.textContent : ""}`,
						"",
					),
				] as const;
			}),
		),
	};
}

export function ReplBlock(props: ReplWrapperProps) {
	const c = children(() => props.children);

	const extensions = useContext(ReplContext);

	const [virtualFs, setVirtualFs] = createStore<Record<string, string>>({});

	onMount(() => {
		const container = c();

		if (!isHTMLElement(container)) {
			console.error(
				"Expected children of ReplBlock to be a HTMLElement, but received:",
				container,
			);
			return;
		}

		const { content, frames, tabNames } = extractContentFromHTML(container);

		setVirtualFs(content);

		if (globalThis.HTMLElement && container instanceof globalThis.HTMLElement) {
			return;
			frames.forEach((element, index) => {
				render(
					() => (
						<Suspense>
							<TmTextarea
								value={virtualFs[tabNames[index]]}
								onInput={({ currentTarget: { value } }) =>
									setVirtualFs(tabNames[index], value)
								}
								grammar="tsx"
								theme="andromeeda"
							/>
						</Suspense>
					),
					element,
				);
			});
		}
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

	const currentFileUrl = () => {
		const fileUrl = fileUrls()?.get(props.main);

		if (!fileUrl) return undefined;

		if (props.main.endsWith("html")) {
			return fileUrl;
		}

		return createFileUrl(
			`<script type="module" src="${fileUrl}"></script>`,
			"html",
		);
	};

	return (
		<div class={styles["repl-wrapper"]}>
			{c()}
			<div class={styles["repl-iframe-container"]}>
				<iframe
					src={currentFileUrl()}
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

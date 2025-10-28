import { Tabs } from "@kobalte/core";
import {
	cookieStorage,
	makePersisted,
	messageSync,
} from "@solid-primitives/storage";
import {
	type Accessor,
	For,
	createSignal,
} from "solid-js";
import { usePreferredLanguage } from "../../client/preferred-language";
import styles from "../mdx-components.module.css";

export interface TabsComponentProps {
	tabNames?: string[];
	tabChildren: any[];
	title?: string;
	withTsJsToggle?: boolean;
	value?: Accessor<string>;
	onChange?: (s: string) => void;
}

export function TabsComponent(props: TabsComponentProps) {
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
						<div>{props.tabChildren[i()]}</div>
					</Tabs.Content>
				)}
			</For>
		</Tabs.Root>
	);
}

export function TabsWithPersistence(props: Omit<TabsComponentProps, 'value' | 'onChange'>) {
	if (!props.title || !props.tabNames?.length) {
		return <TabsComponent {...props} />;
	}

	const [openTab, setOpenTab] = makePersisted(createSignal(props.tabNames[0]!), {
		name: `tab-group:${props.title}`,
		sync: messageSync(new BroadcastChannel("tab-group")),
		storage: cookieStorage.withOptions({
			expires: new Date(+new Date() + 3e10),
		}),
	});

	return <TabsComponent {...props} value={openTab} onChange={setOpenTab} />;
}
import { A } from "@solidjs/router";
import {
	type ComponentProps,
	type ParentProps,
	Show,
	children,
	splitProps,
} from "solid-js";
import { ReplWrapper } from "./components/ReplWrapper";
import { TabsComponent, TabsWithPersistence } from "./components/TabsComponent";
import styles from "./mdx-components.module.css";

export function h1(props: ComponentProps<"h1">) {
	return <h1 class={styles.h1} {...props} />;
}

export function h2(props: ComponentProps<"h2">) {
	return <h2 class={styles.h2} {...props} />;
}

export function h3(props: ComponentProps<"h3">) {
	return <h3 class={styles.h3} {...props} />;
}

export function h4(props: ComponentProps<"h4">) {
	return <h4 class={styles.h4} {...props} />;
}

export function h5(props: ComponentProps<"h5">) {
	return <h5 class={styles.h5} {...props} />;
}

export function h6(props: ComponentProps<"h6">) {
	return <h6 class={styles.h6} {...props} />;
}

export function a(props: ComponentProps<"a"> & { "data-auto-heading"?: "" }) {
	const outbound = () => (props.href ?? "").includes("//");
	const autoHeading = () => props["data-auto-heading"] === "";

	return (
		<A
			target={outbound() ? "_blank" : undefined}
			rel={outbound() ? "noopener noreferrer" : undefined}
			class={autoHeading() ? styles["a-auto"] : styles.a}
			href={props.href ?? ""}
			{...props}
		/>
	);
}

export function code(props: ComponentProps<"code">) {
	return <code class={styles.code} {...props} />;
}

export function hr(props: ComponentProps<"hr">) {
	return <hr class={styles.hr} {...props} />;
}

export function table(props: ComponentProps<"table">) {
	const [local, others] = splitProps(props, ["class"]);

	return (
		<div class={styles.table}>
			<table {...others} />
		</div>
	);
}

export function blockquote(props: ComponentProps<"blockquote">) {
	return <blockquote class={styles.blockquote} {...props} />;
}

export function p(props: ComponentProps<"p">) {
	return <p class={styles.p} {...props} />;
}

export function li(props: ComponentProps<"li">) {
	return <li class={styles.li} {...props} />;
}

export function ul(props: ComponentProps<"ul">) {
	return <ul class={styles.ul} {...props} />;
}

export function ol(props: ComponentProps<"ol">) {
	return <ol class={styles.ol} {...props} />;
}

export function DirectiveContainer(
	props: {
		type:
			| "info"
			| "note"
			| "tip"
			| "important"
			| "warning"
			| "danger"
			| "caution"
			| "details"
			| "tab-group"
			| "tab";
		title?: string;
		codeGroup?: string;
		tabNames?: string;
		withTsJsToggle?: string;
		hasRepl?: string;
		main?: string;
	} & ParentProps,
) {
	const _children = children(() => props.children).toArray();

	if (props.type === "tab") {
		// Return only the code block, not the title
		// The structure is [title element, code block]
		return _children[1] || _children;
	}

	if (props.type === "tab-group") {
		const tabNames = props.tabNames?.split("\0");
		const hasRepl = props.hasRepl === "true";

		const tabsProps = {
			tabNames,
			tabChildren: _children,
			title: props.title,
			withTsJsToggle: props.withTsJsToggle === "true",
		};

		// If this tab group has REPL tabs, render the REPL instead
		if (hasRepl) {
			return <ReplWrapper {...tabsProps} main={props.main ?? ""} />;
		}

		// If no title, use basic TabsComponent without persistence
		if (!props.title) {
			return <TabsComponent {...tabsProps} />;
		}

		// Otherwise use TabsWithPersistence
		return <TabsWithPersistence {...tabsProps} />;
	}

	if (props.type === "details") {
		return (
			<details
				class={styles["custom-container"]}
				data-custom-container="details"
			>
				<summary>{props.title ?? props.type}</summary>
				{_children}
			</details>
		);
	}

	return (
		<div class={styles["custom-container"]} data-custom-container={props.type}>
			<Show when={props.title !== " "}>
				<span>{props.title ?? props.type}</span>
			</Show>
			{_children}
		</div>
	);
}

export function Steps(props: ParentProps) {
	return <div class={styles.steps}>{props.children}</div>;
}

export function Step(props: ParentProps) {
	return <div class={styles.step}>{props.children}</div>;
}

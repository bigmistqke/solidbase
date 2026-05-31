import { Tabs } from "@kobalte/core";
import { cookieStorage, makePersisted, messageSync, } from "@solid-primitives/storage";
import { A } from "@solidjs/router";
import { children, createSignal, For, Show, splitProps, } from "solid-js";
import { usePreferredLanguage } from "../client/preferred-language.js";
import CopyPageLink from "../default-theme/components/CopyPageLink.jsx";
import { Preview, PreviewPanel, PreviewStage } from "./components/Preview.jsx";
import { useDefaultThemeComponents } from "./context.jsx";
import { useDefaultThemeFrontmatter } from "./frontmatter.js";
import styles from "./mdx-components.module.css";
export function h1(props) {
    const frontmatter = useDefaultThemeFrontmatter();
    const { Badges } = useDefaultThemeComponents();
    return (<div class={styles.actions}>
			<div class={styles.title}>
				<h1 class={styles.h1} {...props}/>
				<Show when={frontmatter()?.copyButton !== false}>
					<div class={styles.pageAction}>
						<CopyPageLink />
					</div>
				</Show>
			</div>
			<Badges badges={frontmatter()?.badges}/>
		</div>);
}
export function h2(props) {
    return <h2 class={styles.h2} {...props}/>;
}
export function h3(props) {
    return <h3 class={styles.h3} {...props}/>;
}
export function h4(props) {
    return <h4 class={styles.h4} {...props}/>;
}
export function h5(props) {
    return <h5 class={styles.h5} {...props}/>;
}
export function h6(props) {
    return <h6 class={styles.h6} {...props}/>;
}
export function a(props) {
    const href = () => props.href ?? "";
    const outbound = () => href().includes("//");
    const internal = () => href().startsWith("/") && !href().startsWith("//");
    const autoHeading = () => props["data-auto-heading"] === "";
    const className = () => (autoHeading() ? styles["a-auto"] : styles.a);
    return (<Show when={internal()} fallback={<a target={outbound() ? "_blank" : undefined} rel={outbound() ? "noopener noreferrer" : undefined} class={className()} href={href()} {...props}/>}>
			<A class={className()} {...props} href={href()}/>
		</Show>);
}
export function code(props) {
    return <code class={styles.code} {...props}/>;
}
export function hr(props) {
    return <hr class={styles.hr} {...props}/>;
}
export function table(props) {
    const [_local, others] = splitProps(props, ["class"]);
    return (<div class={styles.table}>
			<table {...others}/>
		</div>);
}
export function blockquote(props) {
    return <blockquote class={styles.blockquote} {...props}/>;
}
export function p(props) {
    return <p class={styles.p} {...props}/>;
}
export function li(props) {
    return <li class={styles.li} {...props}/>;
}
export function ul(props) {
    return <ul class={styles.ul} {...props}/>;
}
export function ol(props) {
    return <ol class={styles.ol} {...props}/>;
}
export function DirectiveContainer(props) {
    const _children = children(() => props.children).toArray();
    if (props.type === "tab") {
        return _children;
    }
    if (props.type === "tab-group") {
        const tabNames = props.tabNames?.split("\0");
        const [preferredLanguage] = usePreferredLanguage();
        const tabs = (value, onChange) => (<Tabs.Root value={value?.()} onChange={onChange} class={styles["tabs-container"]}>
				<Tabs.List class={styles["tabs-list"]}>
					{tabNames?.map((title) => {
                const jsTitle = title.replace(/\.tsx?$/, (ext) => {
                    if (ext === ".tsx") {
                        return ".jsx";
                    }
                    if (ext === ".ts") {
                        return ".js";
                    }
                    return ext;
                });
                return (<Tabs.Trigger class={styles["tabs-trigger"]} value={title}>
								{preferredLanguage() === "ts" ? title : jsTitle}
							</Tabs.Trigger>);
            })}
					<Tabs.Indicator class={styles["tabs-indicator"]}/>
					{props.withTsJsToggle === "true" && (<input type="checkbox" checked title="Toggle language" aria-label="Toggle TS/JS" class="sb-ts-js-toggle"/>)}
				</Tabs.List>

				<For each={tabNames}>
					{(title, i) => (<Tabs.Content value={title} forceMount={true} class={styles["tabs-content"]}>
							<div>{_children[i()]}</div>
						</Tabs.Content>)}
				</For>
			</Tabs.Root>);
        if (!props.title)
            return tabs();
        const [openTab, setOpenTab] = makePersisted(createSignal(tabNames[0]), {
            name: `tab-group:${props.title}`,
            sync: messageSync(new BroadcastChannel("tab-group")),
            storage: cookieStorage.withOptions({
                expires: new Date(Date.now() + 3e10),
            }),
        });
        return tabs(openTab, setOpenTab);
    }
    if (props.type === "details") {
        return (<details class={styles["custom-container"]} data-custom-container="details">
				<summary>{props.title ?? props.type}</summary>
				{_children}
			</details>);
    }
    return (<div class={styles["custom-container"]} data-custom-container={props.type}>
			<Show when={props.title !== " "}>
				<span>{props.title ?? props.type}</span>
			</Show>
			{_children}
		</div>);
}
export { Preview, PreviewPanel, PreviewStage };
export function Steps(props) {
    return <div class={styles.steps}>{props.children}</div>;
}
export function Step(props) {
    return <div class={styles.step}>{props.children}</div>;
}
//# sourceMappingURL=mdx-components.jsx.map
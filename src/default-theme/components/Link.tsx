import { A } from "@solidjs/router";
import { type ComponentProps, Show } from "solid-js";
import styles from "./Link.module.css";

export default function Link(props: ComponentProps<"a">) {
	const href = () => props.href ?? "";
	const outbound = () => href().includes("://");
	const internal = () => href().startsWith("/") && !href().startsWith("//");

	return (
		<Show
			when={internal()}
			fallback={
				<a
					class={styles.link}
					target={outbound() ? "_blank" : undefined}
					rel={outbound() ? "noopener noreferrer" : undefined}
					{...props}
				/>
			}
		>
			<A class={styles.link} {...props} href={href()} />
		</Show>
	);
}

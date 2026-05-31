import { A } from "@solidjs/router";
import { Show } from "solid-js";
import styles from "./Link.module.css";
export default function Link(props) {
    const href = () => props.href ?? "";
    const outbound = () => href().includes("://");
    const internal = () => href().startsWith("/") && !href().startsWith("//");
    return (<Show when={internal()} fallback={<a class={styles.link} target={outbound() ? "_blank" : undefined} rel={outbound() ? "noopener noreferrer" : undefined} {...props}/>}>
			<A class={styles.link} {...props} href={href()}/>
		</Show>);
}
//# sourceMappingURL=Link.jsx.map
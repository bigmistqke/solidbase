import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import { useDefaultThemeFrontmatter } from "../frontmatter.js";
import styles from "./Hero.module.css";
export default function Hero(props) {
    const frontmatter = useDefaultThemeFrontmatter();
    const data = () => props.data;
    return (<div class={styles.hero}>
			<div>
				<h1>{frontmatter()?.title}</h1>
				<Show when={data().text}>{(t) => <p>{t()}</p>}</Show>
				<Show when={data().tagline}>
					{(t) => <p class={styles.tagline}>{t()}</p>}
				</Show>

				<Show when={data().actions}>
					{(actions) => (<div class={styles.actions}>
							<For each={actions()}>
								{(action) => {
                const outbound = () => !!action.link?.startsWith("http");
                const className = `${styles.action} ${action.theme ?? "brand"}`;
                return (<Show when={outbound()} fallback={<A class={className} href={action.link}>
													{action.text}
												</A>}>
											<a class={className} href={action.link} target="_blank" rel="noopener noreferrer">
												{action.text}
											</a>
										</Show>);
            }}
							</For>
						</div>)}
				</Show>
			</div>
			<Show when={data().image}>
				{(image) => (<div class={styles.image}>
						<div class={styles["image-bg"]}/>
						<img src={image().src} alt={image().alt} role={!image().alt ? "presentation" : undefined}/>
					</div>)}
			</Show>
		</div>);
}
//# sourceMappingURL=Hero.jsx.map
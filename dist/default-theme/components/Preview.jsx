import styles from "../mdx-components.module.css";
export function Preview(props) {
    return (<div class={styles.preview} data-preview-root>
			{props.children}
		</div>);
}
export function PreviewStage(props) {
    return (<div class={styles["preview-stage"]} data-preview-stage>
			<div class={styles["preview-stage-inner"]}>{props.children}</div>
		</div>);
}
export function PreviewPanel(props) {
    return (<div class={styles["preview-panel"]} data-preview-panel>
			{props.children}
		</div>);
}
//# sourceMappingURL=Preview.jsx.map
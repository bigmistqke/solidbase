import { WindowEventListener } from "@solid-primitives/event-listener";
import { createShortcut } from "@solid-primitives/keyboard";
import { isAppleDevice } from "@solid-primitives/platform";
import { A } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { useCurrentPageData } from "../../client/index.jsx";
import { usePrevNext } from "../../client/sidebar.js";
import { useDefaultThemeComponents, useDefaultThemeState, } from "../context.jsx";
import { mobileLayout } from "../globals.js";
import { useSolidBaseContext, useThemeText } from "../utils.js";
import styles from "./Article.module.css";
export default function Article(props) {
    const { config } = useSolidBaseContext();
    const text = useThemeText();
    const { frontmatter } = useDefaultThemeState();
    const { TableOfContents, Link, LastUpdated, Footer, Hero, Features } = useDefaultThemeComponents();
    const [_contentRef, setContentRef] = createSignal();
    const [clickedCodeElement, setClickedCodeElement] = createSignal();
    const pageData = useCurrentPageData();
    function closestEC(node) {
        return (node?.closest("div.expressive-code code") ??
            undefined);
    }
    createShortcut([isAppleDevice ? "Meta" : "Control", "A"], (event) => {
        // Only handle when code last clicked and no focus or copy button focused
        if ((clickedCodeElement() && document.activeElement === document.body) ||
            closestEC(event?.target)) {
            const targetNode = closestEC(event?.target) ?? clickedCodeElement();
            if (window.getSelection()?.anchorNode?.nodeName === "PRE" &&
                window.getSelection()?.anchorNode?.hasAttribute("data-language")) {
                return; // Code already selected, select all (default) instead.
            }
            const range = document.createRange();
            range.selectNode(targetNode);
            window.getSelection()?.removeAllRanges();
            window.getSelection()?.addRange(range);
            event?.preventDefault();
        }
    }, { preventDefault: false });
    const onClick = (event) => {
        if (event.target) {
            const closestCode = closestEC(event.target);
            setClickedCodeElement(closestCode);
        }
    };
    const prevNext = usePrevNext();
    const hasPrev = () => (prevNext.prevLink() && frontmatter()?.prev !== false) ||
        frontmatter()?.prev;
    const hasNext = () => (prevNext.nextLink() && frontmatter()?.next !== false) ||
        frontmatter()?.next;
    const customTitle = (r) => typeof r === "string" ? r : typeof r === "object" ? r.text : undefined;
    const customLink = (r) => typeof r === "object" ? r.link : undefined;
    return (<>
			<WindowEventListener onClick={onClick}/>

			<article class={styles.article}>
				<div ref={setContentRef} class={styles.content}>
					<Show when={frontmatter()?.hero}>
						{(data) => <Hero data={data()}/>}
					</Show>
					<Show when={frontmatter()?.features}>
						{(data) => <Features features={data()}/>}
					</Show>

					{props.children}

					<div class={styles.info}>
						<Show when={frontmatter()?.lastUpdated} fallback={<div />}>
							<LastUpdated />
						</Show>

						<div class={styles.actions}>
							<Show when={pageData()?.editLink && frontmatter()?.editLink}>
								<Link href={pageData()?.editLink}>{text.editPage}</Link>
							</Show>
						</div>
					</div>

					<Show when={hasPrev() || hasNext()}>
						<nav class={styles.related}>
							<div>
								<Show when={hasPrev()}>
									<A class={styles.prev} href={customLink(frontmatter()?.prev) ??
            prevNext.prevLink().link}>
										<span>Previous</span>
										{customTitle(frontmatter()?.prev) ??
            prevNext.prevLink().title}
									</A>
								</Show>
							</div>
							<div>
								<Show when={hasNext()}>
									<A class={styles.next} href={customLink(frontmatter()?.next) ??
            prevNext.nextLink().link}>
										<span>Next</span>
										{customLink(frontmatter()?.next) ??
            prevNext.nextLink().title}
									</A>
								</Show>
							</div>
						</nav>
					</Show>

					<Show when={config().themeConfig?.footer !== false &&
            frontmatter()?.footer !== false}>
						<Footer />
					</Show>
				</div>

				<Show when={!mobileLayout() &&
            (frontmatter()?.toc ?? frontmatter()?.layout !== "home")}>
					<aside class={styles.aside}>
						<TableOfContents />
					</aside>
				</Show>
			</article>
		</>);
}
//# sourceMappingURL=Article.jsx.map
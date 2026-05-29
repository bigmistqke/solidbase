import { useWindowScrollPosition } from "@solid-primitives/scroll";
import { createEffect, createSignal, For, Show } from "solid-js";
import { useCurrentPageData, } from "../../client/index.jsx";
import styles from "./TableOfContents.module.css";
export default function TableOfContents(_props) {
    const toc = () => useCurrentPageData()()?.toc;
    const [currentSection, setCurrentSection] = createSignal();
    const scroll = useWindowScrollPosition();
    const [headingPositions, setHeadingPositions] = createSignal([]);
    createEffect(() => {
        const t = toc();
        if (!t)
            return [];
        setHeadingPositions(t.flatMap(flattenData).map((href) => {
            const el = document.getElementById(href.slice(1));
            if (!el) {
                return {
                    url: href,
                    top: undefined,
                };
            }
            const style = window.getComputedStyle(el);
            const scrollMt = Number.parseFloat(style.scrollMarginTop) + 1;
            const top = window.scrollY + el.getBoundingClientRect().top - scrollMt - 50;
            return {
                url: href,
                top,
            };
        }));
    });
    createEffect(() => {
        const top = scroll.y;
        let current = headingPositions()[0]?.url;
        for (const heading of headingPositions()) {
            if (!heading.top)
                continue;
            if (top >= heading.top) {
                current = heading.url;
            }
            else {
                break;
            }
        }
        setCurrentSection(current);
    });
    return (<Show when={toc()}>
			{(toc) => (<nav class={styles.toc}>
					<span>On This Page</span>
					<ol>
						<For each={toc()}>
							{(toc) => (<TableOfContentsItem data={toc} current={currentSection()}/>)}
						</For>
					</ol>
				</nav>)}
		</Show>);
}
function TableOfContentsItem(props) {
    const [ref, setRef] = createSignal();
    const handleClick = (event) => {
        const header = document.querySelector("header");
        header?.setAttribute("data-scrolling-to-header", "");
        document
            .getElementById(event.target.getAttribute("href").slice(1))
            ?.scrollIntoView(true);
    };
    createEffect(() => {
        const header = document.querySelector("header");
        header?.setAttribute("data-scrolling-to-header", "");
        if (props.data.href === props.current && !elementInViewport(ref())) {
            ref()?.scrollIntoView({ behavior: "smooth" });
        }
        setTimeout(() => header?.removeAttribute("data-scrolling-to-header"));
    });
    return (<li class={styles.item}>
			<a ref={setRef} onClick={handleClick} href={props.data.href} class={props.data.href === props.current ? styles.active : undefined}>
				{props.data.title}
			</a>
			<Show when={props.data.children && props.data.children.length > 0}>
				<ol>
					<For each={props.data.children}>
						{(nested) => (<TableOfContentsItem data={nested} current={props.current}/>)}
					</For>
				</ol>
			</Show>
		</li>);
}
function flattenData(data) {
    return [data?.href, ...(data?.children ?? []).flatMap(flattenData)].filter(Boolean);
}
function elementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
            (window.innerHeight ||
                document.documentElement.clientHeight) /* or $(window).height() */ &&
        rect.right <=
            (window.innerWidth ||
                document.documentElement.clientWidth) /* or $(window).width() */);
}
//# sourceMappingURL=TableOfContents.jsx.map
import { solidBaseConfig } from "virtual:solidbase/config";
import { Popover } from "@kobalte/core/popover";
import { A } from "@solidjs/router";
import { createMemo, createSignal, For, Show } from "solid-js";
import IconExpandUpDownLine from "~icons/ri/expand-up-down-line";
import { useSolidBaseRoute } from "../../client/index.jsx";
import { getSolidBaseRouteFallbackOptions, } from "../../config/route-config.js";
import styles from "./ProjectSelector.module.css";
const PROJECT_AXIS = "project";
export default function ProjectSelector() {
    const [open, setOpen] = createSignal(false);
    const current = useSolidBaseRoute();
    const options = createMemo(() => getSolidBaseRouteFallbackOptions(solidBaseConfig.routes, PROJECT_AXIS, current()));
    const currentOption = createMemo(() => options().find((option) => option.name === current()[PROJECT_AXIS]));
    const getOptionLabel = (option) => {
        return typeof option.meta.label === "string"
            ? option.meta.label
            : option.name;
    };
    return (<Show when={options().length > 1 && currentOption()}>
			{(current) => (<Popover open={open()} onOpenChange={setOpen} gutter={4} sameWidth placement="bottom-start">
					<Popover.Trigger class={styles.trigger} aria-label="Change project">
						<span class={styles.label}>{getOptionLabel(current())}</span>
						<IconExpandUpDownLine class={styles.icon} aria-hidden/>
					</Popover.Trigger>
					<Popover.Portal>
						<Popover.Content class={styles.content}>
							<For each={options()}>
								{(option) => {
                const outbound = () => !!option.href;
                return (<Show when={outbound()} fallback={<A class={styles.item} aria-current={option === currentOption() || undefined} href={option.path ?? ""} onMouseEnter={(e) => e.currentTarget.focus()} onClick={() => setOpen(false)}>
													{getOptionLabel(option)}
												</A>}>
											<a class={styles.item} target="_blank" rel="noopener noreferrer" aria-current={option === currentOption() || undefined} href={option.href} onMouseEnter={(e) => e.currentTarget.focus()} onClick={() => setOpen(false)}>
												{getOptionLabel(option)}
											</a>
										</Show>);
            }}
							</For>
						</Popover.Content>
					</Popover.Portal>
				</Popover>)}
		</Show>);
}
//# sourceMappingURL=ProjectSelector.jsx.map
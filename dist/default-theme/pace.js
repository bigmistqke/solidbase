import { BProgress } from "@bprogress/core";
import { useIsRouting } from "@solidjs/router";
import { createEffect, onCleanup } from "solid-js";
import "@bprogress/core/css";
export function usePace(options) {
    const isRouting = useIsRouting();
    BProgress.configure({
        showSpinner: false,
        ...options,
    });
    let paceTimeoutId;
    createEffect(() => {
        if (isRouting()) {
            paceTimeoutId = window.setTimeout(() => BProgress.start(), 100);
        }
        else {
            clearTimeout(paceTimeoutId);
            BProgress.done();
        }
    });
    onCleanup(() => {
        clearTimeout(paceTimeoutId);
    });
}
//# sourceMappingURL=pace.js.map
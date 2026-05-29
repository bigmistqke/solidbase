import { usePrefersDark } from "@solid-primitives/media";
import { useHead } from "@solidjs/meta";
import { createEffect, createSignal, createUniqueId } from "solid-js";
import { getRequestEvent, isServer } from "solid-js/web";
function getCookie(name, cookieString) {
    if (!name || !cookieString)
        return "system";
    const match = cookieString.match(new RegExp(`\\W?${name}=(?<theme>\\w+)`));
    return match?.groups?.theme || "system";
}
function getThemeCookie() {
    if (isServer) {
        const e = getRequestEvent();
        return (getCookie("theme", e.request.headers.get("cookie")) ??
            "system");
    }
    return getCookie("theme", document.cookie);
}
const [theme, _setTheme] = createSignal();
export function getRawTheme() {
    if (isServer)
        return getThemeCookie();
    const prefersDark = usePrefersDark();
    const prefersTheme = () => (prefersDark() ? "sdark" : "slight");
    if (theme())
        return theme().startsWith("s")
            ? prefersTheme()
            : theme();
    const userTheme = getThemeCookie();
    if (userTheme && !userTheme.startsWith("s")) {
        setTheme(userTheme);
        return userTheme;
    }
    return prefersTheme();
}
export function getTheme() {
    return getRawTheme().replace("s", "");
}
export function getThemeVariant() {
    const t = getRawTheme();
    if (t.startsWith("s"))
        return "system";
    return t;
}
export const setTheme = _setTheme;
import readThemeCookieScript from "./read-theme-cookie.js?raw";
export function useThemeListener() {
    createEffect(() => {
        document.documentElement.setAttribute("data-theme", getRawTheme());
        // biome-ignore lint/suspicious/noDocumentCookie: remove next major
        document.cookie = `theme=${getRawTheme()}; max-age=31536000; path=/`;
    });
    useHead({
        tag: "script",
        id: createUniqueId(),
        props: { children: readThemeCookieScript },
        setting: { close: true },
    });
}
//# sourceMappingURL=theme.js.map
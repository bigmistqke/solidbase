export { useRouteSolidBaseConfig } from "./config";
export { useSolidBaseContext } from "./context";
export {
	getLocale,
	getLocaleLink,
	useLocale,
	type ResolvedLocale,
} from "./locale";
export {
	useCurrentPageData,
	useFrontmatter,
	type BaseFrontmatter,
	type TableOfContentsItemData,
} from "./page-data";
export { usePreferredLanguage } from "./preferred-language";
export { SolidBaseRoot } from "./Root";
export {
	getTheme,
	getThemeVariant,
	setTheme,
	useThemeListener,
	type ThemeType,
} from "./theme";

export type * from "./sidebar";
export { SidebarProvider, usePrevNext, useSidebar } from "./sidebar";

export { ReplProvider } from "../default-theme/components/ReplBlock";

export { mdxComponents } from "virtual:solidbase/components";

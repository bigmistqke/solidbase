import { type ParentProps } from "solid-js";
import type { BadgeConfig } from "../frontmatter.js";
export default function Badges(props: ParentProps<{
    badges?: Array<BadgeConfig>;
}>): import("solid-js").JSX.Element;

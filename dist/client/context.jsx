import { createContext, useContext } from "solid-js";
export const SolidBaseContext = createContext();
export function useSolidBaseContext() {
    const context = useContext(SolidBaseContext);
    if (context === undefined) {
        if (import.meta.env.VITE_SOLIDBASE_DEV)
            location.reload();
        throw new Error("[SolidBase]: `useSolidBaseContext` must be used within a `SolidBase` component");
    }
    return context;
}
//# sourceMappingURL=context.jsx.map
import { defaultFileUrlSystem } from "@bigmistqke/repl";
import { createMemo, createEffect, createSignal } from "solid-js";
import * as ts from "typescript";
import { TabsComponent } from "./TabsComponent";
import styles from "../mdx-components.module.css";
export function ReplWrapper(props) {
    const [iframeUrl, setIframeUrl] = createSignal("");
    // Create virtual filesystem from tab files
    const virtualFs = createMemo(() => {
        const files = {};
        if (props.tabNames && props.tabChildren) {
            props.tabNames.forEach((fileName, index) => {
                const content = props.tabChildren[index];
                // Extract text content from the code element
                const textContent = typeof content === 'string'
                    ? content
                    : content?.props?.children || '';
                files[fileName] = textContent;
            });
        }
        return files;
    });
    // Determine main file and its type
    const mainFileInfo = createMemo(() => {
        const files = virtualFs();
        const mainFile = props.main || props.tabNames?.[0] || 'index.html';
        const fileExtension = mainFile.split('.').pop()?.toLowerCase() || '';
        const isHtml = fileExtension === 'html';
        const isScript = ['js', 'jsx', 'ts', 'tsx'].includes(fileExtension);
        return { mainFile, fileExtension, isHtml, isScript };
    });
    // Create file URL system and update iframe URL
    createEffect(() => {
        const files = virtualFs();
        const { mainFile, isHtml, isScript } = mainFileInfo();
        try {
            const fileUrls = defaultFileUrlSystem({
                readFile: (path) => {
                    // Remove leading slash for lookup
                    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
                    return files[cleanPath] || '';
                },
                ts
            });
            let url;
            if (isHtml) {
                // For HTML files, use them directly as iframe src
                url = fileUrls.get(`/${mainFile}`);
            }
            else if (isScript) {
                // For JS/TS files, create an HTML wrapper that imports and executes them
                const wrapperHtml = `<!DOCTYPE html>
<html>
<head>
	<title>REPL</title>
	<meta charset="utf-8">
	<style>
		body { font-family: system-ui, sans-serif; padding: 20px; }
		#root { min-height: 200px; }
	</style>
</head>
<body>
	<div id="root"></div>
	<script type="module">
		try {
			await import('./${mainFile}');
		} catch (error) {
			document.getElementById('root').innerHTML = 
				'<div style="color: red; padding: 10px; border: 1px solid red; border-radius: 4px;">' +
				'<strong>Error:</strong> ' + error.message + 
				'</div>';
			console.error('REPL Error:', error);
		}
	</script>
</body>
</html>`;
                // Add the wrapper HTML to the file system
                const extendedFiles = { ...files, '__wrapper.html': wrapperHtml };
                const extendedFileUrls = defaultFileUrlSystem({
                    readFile: (path) => {
                        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
                        return extendedFiles[cleanPath] || '';
                    },
                    ts
                });
                url = extendedFileUrls.get('/__wrapper.html');
            }
            if (url) {
                setIframeUrl(url);
            }
        }
        catch (error) {
            console.error('Error creating file URL system:', error);
        }
    });
    return (<div class={styles["repl-wrapper"]}>
			{/* Tabs on the left */}
			<div class={styles["repl-tabs"]}>
				<TabsComponent {...props}/>
			</div>
			
			{/* REPL iframe on the right */}
			<div class={styles["repl-iframe-container"]}>
				<iframe src={iframeUrl()} class={styles["repl-iframe"]} title="REPL Output"/>
			</div>
		</div>);
}
//# sourceMappingURL=ReplWrapper.jsx.map
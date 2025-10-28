import { PathUtils, transformModulePaths } from "@bigmistqke/repl";
import { ReplProvider, SolidBaseRoot } from "@kobalte/solidbase/client";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import ts from "typescript";

import "./app.css";

export default function App() {
	return (
		<Router root={SolidBaseRoot}>
			<ReplProvider
				value={{
					js: {
						type: "javascript",
						transform({ source, path: parentPath, fileUrls }) {
							return transformModulePaths({
								ts,
								source,
								transform(path) {
									if (path.startsWith(".")) {
										return (
											fileUrls.get(
												`./${PathUtils.resolvePath(parentPath, path)}`,
											) ?? ""
										);
									}
									if (path.startsWith("http")) {
										return path;
									}
									return `https://esm.sh/${path}`;
								},
							});
						},
					},
				}}
			>
				<FileRoutes />
			</ReplProvider>
		</Router>
	);
}

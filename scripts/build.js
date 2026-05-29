import { existsSync } from "node:fs";
import * as fs from "node:fs/promises";
import { glob } from "node:fs/promises";
import * as path from "node:path";

const distDir = path.join(import.meta.dirname, "../dist");
const srcDir = path.join(import.meta.dirname, "../src");

// Copy non-compiled assets (.js/.css that live in src) into dist.
const assets = await Array.fromAsync(glob("**/*.{js,css}", { cwd: srcDir }));
await Promise.all(
	assets.map((file) =>
		fs.cp(path.join(srcDir, file), path.join(distDir, file), {
			recursive: true,
		}),
	),
);

// tsc emits JSX-bearing modules as .jsx (jsx: preserve) but keeps the ".js"
// import specifiers TypeScript requires in source. Rewrite those specifiers to
// the real ".jsx" file so any bundler resolves them without a consumer-side
// shim. Only relative specifiers whose ".jsx" sibling exists are touched.
const distFiles = await Array.fromAsync(glob("**/*.{js,jsx}", { cwd: distDir }));
await Promise.all(
	distFiles.map(async (file) => {
		const abs = path.join(distDir, file);
		const code = await fs.readFile(abs, "utf8");
		const fixed = code.replace(
			/(["'])(\.\.?\/[^"']+)\.js\1/g,
			(match, quote, spec) => {
				const target = path.resolve(path.dirname(abs), `${spec}.jsx`);
				return existsSync(target) ? `${quote}${spec}.jsx${quote}` : match;
			},
		);
		if (fixed !== code) await fs.writeFile(abs, fixed);
	}),
);

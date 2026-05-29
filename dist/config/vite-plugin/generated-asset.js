import { access, mkdir, readFile, rm, stat } from "node:fs/promises";
import { join, normalize, relative } from "node:path";
export async function emptyDir(dir) {
    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });
}
export function createGeneratedAssetPlugin(options) {
    let root = process.cwd();
    let assetRoot = join(root, options.assetDir);
    async function serveGeneratedAsset(url, res) {
        if (!url || url === "/")
            return false;
        const pathname = url.split("?")[0] ?? "/";
        const relativePath = pathname.replace(/^\//, "");
        if (!relativePath)
            return false;
        const filePath = normalize(join(assetRoot, relativePath));
        const assetRelativePath = relative(assetRoot, filePath);
        if (assetRelativePath === ".." || assetRelativePath.startsWith(`..`)) {
            return false;
        }
        try {
            await access(filePath);
        }
        catch {
            return false;
        }
        const fileStat = await stat(filePath);
        if (!fileStat.isFile())
            return false;
        const content = await readFile(filePath);
        if (filePath.endsWith(".md")) {
            res.setHeader("Content-Type", "text/markdown; charset=utf-8");
            res.setHeader("Content-Disposition", "inline");
        }
        else if (filePath.endsWith(".txt")) {
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
        }
        res.statusCode = 200;
        res.end(content);
        return true;
    }
    return {
        name: options.name,
        apply: options.apply,
        config(viteConfig) {
            const nitroConfig = viteConfig.nitro ?? {};
            return {
                nitro: {
                    ...nitroConfig,
                    publicAssets: [
                        ...(nitroConfig.publicAssets ?? []),
                        {
                            dir: options.assetDir,
                            baseURL: "/",
                            fallthrough: true,
                            ignore: false,
                        },
                    ],
                },
            };
        },
        configResolved(resolvedConfig) {
            root = resolvedConfig.root;
            assetRoot = join(root, options.assetDir);
        },
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                void serveGeneratedAsset(req.url, res).then((served) => {
                    if (!served)
                        next();
                });
            });
        },
        async buildStart() {
            await options.write(root, (source, importer) => this.resolve(source, importer));
        },
    };
}
//# sourceMappingURL=generated-asset.js.map
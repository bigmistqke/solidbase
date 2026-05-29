import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { buildLlmsIndex, getLlmDocuments } from "../llms-index.js";
import { createGeneratedAssetPlugin, emptyDir } from "./generated-asset.js";
const LLMS_PUBLIC_ASSETS_DIR = join("node_modules", ".solidbase", "llms");
async function writeLlmsAssets(root, config, resolver) {
    const documents = await getLlmDocuments(root, config, resolver);
    const outputDir = join(root, LLMS_PUBLIC_ASSETS_DIR);
    await emptyDir(outputDir);
    await writeFile(join(outputDir, "llms.txt"), buildLlmsIndex(undefined, config, documents), "utf8");
    await Promise.all(documents.map(async (document) => {
        const filePath = join(outputDir, document.markdownPath.slice(1));
        await mkdir(dirname(filePath), { recursive: true });
        await writeFile(filePath, document.content, "utf8");
    }));
}
export default function solidBaseLlmsPlugin(config) {
    if (!config.llms)
        return [];
    return createGeneratedAssetPlugin({
        name: "solidbase:llms",
        apply: "build",
        assetDir: LLMS_PUBLIC_ASSETS_DIR,
        write(root, resolver) {
            return writeLlmsAssets(root, config, resolver);
        },
    });
}
//# sourceMappingURL=llms.js.map
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { buildRobotsTxt } from "../robots.js";
import { createGeneratedAssetPlugin, emptyDir } from "./generated-asset.js";
const ROBOTS_PUBLIC_ASSETS_DIR = join("node_modules", ".solidbase", "robots");
async function writeRobotsAsset(root, config) {
    const robots = buildRobotsTxt(config);
    if (!robots)
        return;
    const outputDir = join(root, ROBOTS_PUBLIC_ASSETS_DIR);
    await emptyDir(outputDir);
    await writeFile(join(outputDir, "robots.txt"), robots, "utf8");
}
export default function solidBaseRobotsPlugin(config) {
    if (!config.robots)
        return [];
    return createGeneratedAssetPlugin({
        name: "solidbase:robots",
        apply: "build",
        assetDir: ROBOTS_PUBLIC_ASSETS_DIR,
        write(root) {
            return writeRobotsAsset(root, config);
        },
    });
}
//# sourceMappingURL=robots.js.map
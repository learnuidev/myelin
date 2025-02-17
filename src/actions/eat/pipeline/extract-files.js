const fs = require("fs/promises");
const path = require("path");

async function extractFiles({ directoryPath }) {
  const result = [];

  async function readDirectory(dir) {
    const entries = await fs.readdir(dir);

    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stats = await fs.stat(fullPath);

      // console.log("DIRECTORY PATH", directoryPath);

      if (stats.isDirectory()) {
        await readDirectory(fullPath);
      } else if (
        stats.isFile() &&
        (entry.endsWith(".jsx") ||
          entry.endsWith(".tsx") ||
          entry.endsWith(".ts") ||
          entry.endsWith(".js"))
      ) {
        const code = await fs.readFile(fullPath, "utf-8");
        result.push({
          dir,
          translationFileName: fullPath
            ?.split("/")
            ?.filter((item) => !directoryPath?.split("/")?.includes(item))
            .join("_")
            ?.replaceAll("-", "_")
            ?.split(".tsx")?.[0]
            ?.split(".jsx")?.[0],
          fileLocation: fullPath,
          fileName: entry,
          code: code,
        });
      }
    }
  }

  await readDirectory(directoryPath);
  return result;
}

module.exports = {
  extractFiles,
};

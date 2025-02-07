const fs = require("fs/promises");
const path = require("path");
const { loadRemoteSourceFiles } = require("./load-remote-source-files");

async function loadJsonFilesFromFolder(
  folderPath,
  { remote } = { remote: false }
) {
  if (remote) {
    const items = await loadRemoteSourceFiles();
    return items;
  }
  // Read the contents of the directory
  const files = await fs.readdir(folderPath);

  // Filter out only .json files
  const jsonFiles = files.filter(
    (file) => path.extname(file).toLowerCase() === ".json"
  );

  // Read and parse each JSON file
  const jsonData = await Promise.all(
    jsonFiles.map(async (file) => {
      const filePath = path.join(folderPath, file);
      const fileContent = await fs.readFile(filePath, "utf-8");
      return {
        baseFileName: file?.split(".")?.[0],
        fileName: file,
        sourceTranslation: JSON.parse(fileContent),
      };
    })
  );

  return jsonData;
}

module.exports = {
  loadJsonFilesFromFolder,
};

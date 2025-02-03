const fs = require("fs/promises");
const path = require("path");

async function loadJsonFilesFromFolder(folderPath) {
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

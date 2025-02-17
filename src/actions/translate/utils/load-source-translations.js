const { getSourceFolderPath } = require("./get-source-folder-path");
const { loadJsonFilesFromFolder } = require("./load-json-files-from-folder");

async function loadSourceTranslations({ config }) {
  const sourceFolderPath = getSourceFolderPath({ config });
  const sourceTranslations = await loadJsonFilesFromFolder(sourceFolderPath);
  return sourceTranslations;
}

module.exports = {
  loadSourceTranslations,
};

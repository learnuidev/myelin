const { note } = require("@clack/prompts");
const {
  getSourceFolderPath,
} = require("../translate/utils/get-source-folder-path");
const { loadConfig } = require("../translate/utils/load-config");
const {
  loadJsonFilesFromFolder,
} = require("../translate/utils/load-json-files-from-folder");

const low = async (subCommands) => {
  // step 1: read config
  const config = await loadConfig();

  if (!config) {
    note(
      "myelin.config.json not found. Please run `npx myelino` to create one",
      "Error"
    );
    return null;
  }

  const sourceFolderPath = getSourceFolderPath({ config });

  const sourceTranslations = await loadJsonFilesFromFolder(sourceFolderPath);

  const allTranslations = sourceTranslations
    ?.map((trans) => Object.values(trans.sourceTranslation).join(" "))
    .join(" ")
    ?.split(" ");

  const uniqueTranslations = [...new Set(allTranslations)];

  const stats = {
    lineOfWords: {
      total: allTranslations?.length,
      unique: uniqueTranslations?.length,
    },
  };

  console.log(stats);
};

module.exports = {
  low,
};
